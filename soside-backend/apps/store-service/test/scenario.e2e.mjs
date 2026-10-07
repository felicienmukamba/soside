// Scénario de bout en bout : gateway + auth-service + store-service lancés sur une base de test jetable.
// Usage : STORE_API=http://localhost:3200 STORE_PG_CONTAINER=soside-store-test-pg node apps/store-service/test/scenario.e2e.mjs
// (la base doit contenir le catalogue de démarrage ; les codes de vérification e-mail sont lus directement en base).
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const API = process.env.STORE_API || 'http://localhost:3200';
const PG = process.env.STORE_PG_CONTAINER || 'soside-store-test-pg';
let passed = 0;
const failures = [];

function check(name, condition, detail) {
  if (condition) { passed++; console.log(`  ok  ${name}`); }
  else { failures.push(name); console.log(`  FAIL ${name}`, detail ?? ''); }
}

async function call(method, path, { body, token, session } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token && { authorization: `Bearer ${token}` }),
      ...(session && { 'x-cart-session': session }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

const sql = (q) => execSync(`docker exec ${PG} psql -U soside_user -d soside_db -tAc "${q.replace(/"/g, '\\"')}"`).toString().trim();

async function account(email, role) {
  await call('POST', '/auth/register', { body: { email, password: 'Motdepasse123', firstName: 'Test', role: 'admin' } });
  const code = sql(`select "verificationCode" from "user" where email='${email}'`);
  await call('POST', '/auth/verify-email', { body: { email, code } });
  if (role) sql(`update "user" set role='${role}' where email='${email}'`);
  const login = await call('POST', '/auth/login', { body: { email, password: 'Motdepasse123' } });
  return login;
}

const variantBySku = async (slug, sku) => (await call('GET', `/store/products/${slug}`)).data.variants.find((v) => v.sku === sku);
const stockOf = (sku) => sql(`select "quantityOnHand"||'/'||"quantityReserved"||'/'||"stockStatus" from store_product_variants where sku='${sku}'`);

console.log('\n# Catalogue public');
const list = await call('GET', '/store/products?limit=50');
check('liste des produits publiés', list.status === 200 && list.data.total === 11, list.data);
const laptops = await call('GET', '/store/products?category=laptops');
check('catégorie parente inclut les sous-catégories', laptops.data.total === 5, laptops.data.total);
const search = await call('GET', '/store/products?q=ecran');
check('recherche insensible aux accents (ecran → Écran)', search.data.total > 0, search.data.total);
const tree = await call('GET', '/store/categories');
check('arbre des catégories avec niveaux', tree.data[0].children.length > 0 && tree.data[0].children[0].level === 1, tree.data);
const iphone = await call('GET', '/store/products/iphone-15-pro');
check('fiche produit : 3 variantes, options et fil d\'Ariane', iphone.data.variants?.length === 3 && iphone.data.options.length === 2 && iphone.data.breadcrumb.length === 1, iphone.data);
const v128 = iphone.data.variants.find((v) => v.sku === 'IPHONE-15P-512-NOIR');
check('variante : stock disponible et statut', v128.available === 2 && v128.stockStatus === 'low_stock', v128);

console.log('\n# Panier invité');
const session = randomUUID();
const add = await call('POST', '/store/cart/items', { session, body: { variantId: v128.id, quantity: 2 } });
check('ajout au panier invité', add.status === 201 && add.data.count === 2, add.data);
const over = await call('POST', '/store/cart/items', { session, body: { variantId: v128.id, quantity: 1 } });
check('refus au-delà du stock (409)', over.status === 409, over.data);
const noSession = await call('GET', '/store/cart');
check('panier sans session → 400', noSession.status === 400);

console.log('\n# Comptes');
const customer = await account(`client-${Date.now()}@test.local`);
check('connexion client → jeton', customer.status === 200 && !!customer.data.token, customer.data);
check('aucun hash de mot de passe renvoyé', !JSON.stringify(customer.data).includes('passwordHash'));
check('rôle forcé à client malgré role=admin à l\'inscription', customer.data.user.role === 'client', customer.data.user);
const token = customer.data.token;
const merged = await call('POST', '/store/cart/merge', { token, session });
check('fusion du panier invité dans le compte', merged.status === 200 && merged.data.count === 2, merged.data);
const admin = (await account(`admin-${Date.now()}@test.local`, 'admin')).data.token;
const forbidden = await call('GET', '/store/admin/orders', { token });
check('back-office interdit à un client (403)', forbidden.status === 403);
check('back-office sans jeton (401)', (await call('GET', '/store/admin/orders')).status === 401);

console.log('\n# Tunnel de commande');
const address = { fullName: 'Client Test', phone: '+243 990 000 001', city: 'Goma', line1: 'Avenue du Lac 12' };
const badCity = await call('POST', '/store/orders', { token, body: { address: { ...address, city: 'Kinshasa' }, paymentMethod: 'cash_on_delivery' } });
check('ville non desservie refusée', badCity.status === 400, badCity.data);
const order = await call('POST', '/store/orders', { token, body: { address, saveAddress: true, paymentMethod: 'cash_on_delivery', noteToSeller: 'Appeler avant' } });
const ref = order.data.reference;
check('commande créée (référence ORD-AAAA-XXXXXX)', order.status === 201 && /^ORD-\d{4}-[2-9A-HJ-NP-Z]{6}$/.test(ref), order.data);
check('snapshots : nom, SKU, prix, adresses', order.data.items[0].productNameSnapshot === 'iPhone 15 Pro' && order.data.items[0].skuSnapshot === 'IPHONE-15P-512-NOIR' && order.data.billingAddressSnapshot.city === 'Goma', order.data.items[0]);
check('totaux : 2 × 1250, livraison offerte, TVA incluse', order.data.subtotal === 2500 && order.data.shippingFee === 0 && order.data.totalAmount === 2500 && order.data.taxAmount > 0, order.data);
check('stock non réservé tant que la commande est en attente', stockOf('IPHONE-15P-512-NOIR') === '2/0/low_stock', stockOf('IPHONE-15P-512-NOIR'));
check('panier vidé après commande', (await call('GET', '/store/cart', { token })).data.count === 0);
check('adresse enregistrée dans le carnet', (await call('GET', '/store/me/addresses', { token })).data.length === 1);

console.log('\n# Préparation, expédition, livraison');
const confirmed = await call('POST', `/store/admin/orders/${ref}/confirm`, { token: admin });
check('confirmation → PROCESSING + facture émise', confirmed.data.orderStatus === 'processing' && /^INV-\d{6}$/.test(confirmed.data.invoice?.invoiceNumber), confirmed.data);
check('stock passé en réservé', stockOf('IPHONE-15P-512-NOIR') === '2/2/out_of_stock', stockOf('IPHONE-15P-512-NOIR'));
check('allocations par entrepôt avec emplacement', confirmed.data.items[0].allocations.reduce((n, a) => n + a.quantity, 0) === 2 && 'binLocation' in confirmed.data.items[0].allocations[0], confirmed.data.items[0].allocations);
check('double confirmation refusée', (await call('POST', `/store/admin/orders/${ref}/confirm`, { token: admin })).status === 409);
const shipped = await call('POST', `/store/admin/orders/${ref}/ship`, { token: admin, body: { carrier: 'DHL', trackingNumber: 'TRK123' } });
check('expédition avec suivi', shipped.data.orderStatus === 'shipped' && shipped.data.trackingNumber === 'TRK123', shipped.data);
check('stock sorti de l\'entrepôt', stockOf('IPHONE-15P-512-NOIR') === '0/0/out_of_stock', stockOf('IPHONE-15P-512-NOIR'));
const delivered = await call('POST', `/store/admin/orders/${ref}/deliver`, { token: admin });
check('livraison COD → COMPLETED + payé', delivered.data.orderStatus === 'completed' && delivered.data.paymentStatus === 'paid', delivered.data);
const invoice = await call('GET', `/store/me/invoices/${delivered.data.invoice.invoiceNumber}`, { token });
check('facture payée, HT + TVA = TTC', invoice.data.status === 'paid' && Math.abs(invoice.data.totalExclTax + invoice.data.totalTax - invoice.data.totalInclTax) < 0.01, invoice.data);
const movements = (await call('GET', `/store/admin/inventory/movements?variantId=${v128.id}`, { token: admin })).data;
check('journal : réservation puis vente tracées', movements.some((m) => m.type === 'reservation' && m.referenceId === ref) && movements.some((m) => m.type === 'sale' && m.quantityChange < 0), movements.map((m) => m.type));
const history = await call('GET', '/store/me/orders', { token });
check('historique client', history.data.length === 1 && history.data[0].reference === ref);
const lookupBad = await call('GET', `/store/orders/lookup?reference=${ref}&phone=%2B243999999999`);
check('suivi invité avec mauvais téléphone → 404', lookupBad.status === 404);

console.log('\n# Logistique');
const warehouses = (await call('GET', '/store/admin/warehouses', { token: admin })).data;
const [goma, bukavu] = warehouses;
check('entrepôt par défaut en premier', goma.isDefault && goma.code === 'GOMA-01' && goma.address.city === 'Goma', warehouses);
const restock = await call('POST', '/store/admin/inventory/operations', { token: admin, body: { variantId: v128.id, warehouseId: goma.id, type: 'restock', quantity: 5, referenceId: 'PO-001' } });
check('réapprovisionnement', restock.status === 201 && stockOf('IPHONE-15P-512-NOIR') === '5/0/in_stock', [restock.data, stockOf('IPHONE-15P-512-NOIR')]);
check('perte sans motif refusée', (await call('POST', '/store/admin/inventory/operations', { token: admin, body: { variantId: v128.id, warehouseId: goma.id, type: 'damage', quantity: 1 } })).status === 400);
await call('POST', '/store/admin/inventory/operations', { token: admin, body: { variantId: v128.id, warehouseId: goma.id, type: 'damage', quantity: 1, reason: 'Écran cassé' } });
const transfer = await call('POST', '/store/admin/inventory/transfers', { token: admin, body: { variantId: v128.id, fromWarehouseId: goma.id, toWarehouseId: bukavu.id, quantity: 2 } });
check('transfert inter-entrepôts', transfer.status === 201 && stockOf('IPHONE-15P-512-NOIR') === '4/0/in_stock', [transfer.data, stockOf('IPHONE-15P-512-NOIR')]);
const adjust = await call('POST', '/store/admin/inventory/operations', { token: admin, body: { variantId: v128.id, warehouseId: bukavu.id, type: 'adjustment', quantity: 1, reason: 'Inventaire' } });
check('ajustement d\'inventaire (compté = 1)', adjust.status === 201 && stockOf('IPHONE-15P-512-NOIR') === '3/0/in_stock', stockOf('IPHONE-15P-512-NOIR'));
await call('PATCH', '/store/admin/inventory/settings', { token: admin, body: { variantId: v128.id, warehouseId: goma.id, binLocation: 'Rayon B, Étagère 3', reorderLevel: 4 } });
const inventory = (await call('GET', '/store/admin/inventory?q=IPHONE-15P-512-NOIR', { token: admin })).data[0];
const gomaLevel = inventory.levels.find((l) => l.warehouseCode === 'GOMA-01');
check('console : physique / réservé / disponible + emplacement', gomaLevel.binLocation === 'Rayon B, Étagère 3' && gomaLevel.needsReorder && inventory.quantityAvailable === 3, inventory);

console.log('\n# Taxonomie & produits');
const root = tree.data.find((c) => c.slug === 'gadgets');
const sub = await call('POST', '/store/admin/categories', { token: admin, body: { name: 'Drones', parentId: root.children[0].id } });
check('sous-catégorie niveau 2', sub.status === 201 && sub.data.level === 2, sub.data);
const cycle = await call('PATCH', `/store/admin/categories/${root.id}`, { token: admin, body: { parentId: sub.data.id } });
check('cycle dans l\'arbre refusé', cycle.status === 400, cycle.data);
const brand = await call('POST', '/store/admin/brands', { token: admin, body: { name: 'DJI', website: 'https://www.dji.com' } });
check('marque créée', brand.status === 201 && brand.data.slug === 'dji', brand.data);
const product = await call('POST', '/store/admin/products', { token: admin, body: {
  name: 'DJI Mini 4 Pro', categoryId: sub.data.id, brandId: brand.data.id, descriptionShort: 'Drone compact 4K',
  descriptionHtml: '<p>Super <b>drone</b></p><script>alert(1)</script><img src="x" onerror="alert(1)">',
  tags: ['drone', '4k'], seoTitle: 'DJI Mini 4 Pro', options: [{ name: 'Pack', type: 'text', values: ['Standard', 'Fly More'] }],
} });
check('fiche parente en brouillon, HTML nettoyé', product.status === 201 && product.data.status === 'draft' && !product.data.descriptionHtml.includes('script') && !product.data.descriptionHtml.includes('onerror'), product.data);
const publishEarly = await call('PATCH', `/store/admin/products/${product.data.id}`, { token: admin, body: { status: 'published' } });
check('publication sans variante refusée', publishEarly.status === 400);
const dup = await call('PUT', `/store/admin/products/${product.data.id}/variants`, { token: admin, body: { variants: [
  { sku: 'DJI-M4P-STD', attributes: { Pack: 'Standard' }, price: 900 }, { sku: 'DJI-M4P-STD2', attributes: { Pack: 'Standard' }, price: 900 },
] } });
check('matrice : combinaison en double refusée', dup.status === 400, dup.data);
const matrix = await call('PUT', `/store/admin/products/${product.data.id}/variants`, { token: admin, body: { variants: [
  { sku: 'DJI-M4P-STD', attributes: { Pack: 'Standard' }, price: 900, costPrice: 700, taxRate: 16, weightKg: 0.249, dimensionsLwh: '15x9x6' },
  { sku: 'DJI-M4P-FMC', attributes: { Pack: 'Fly More' }, price: 1150, compareAtPrice: 1250, weightKg: 0.9, allowBackorder: true },
] } });
check('matrice de 2 variantes enregistrée', matrix.status === 200 && matrix.data.variants.length === 2, matrix.data);
const published = await call('PATCH', `/store/admin/products/${product.data.id}`, { token: admin, body: { status: 'published' } });
check('publication', published.data.status === 'published' && !!published.data.publishedAt, published.data);

console.log('\n# Précommande (allow_backorder) et annulation');
const fmc = await variantBySku('dji-mini-4-pro', 'DJI-M4P-FMC');
check('variante en précommande achetable sans stock', fmc.purchasable && fmc.available === 0, fmc);
await call('POST', '/store/cart/items', { token, body: { variantId: fmc.id, quantity: 2 } });
const pre = await call('POST', '/store/orders', { token, body: { addressId: (await call('GET', '/store/me/addresses', { token })).data[0].id, paymentMethod: 'mobile_money' } });
check('commande avec adresse enregistrée', pre.status === 201, pre.data);
const paid = await call('POST', `/store/admin/orders/${pre.data.reference}/payments`, { token: admin, body: { provider: 'mpesa', transactionRef: 'MP123' } });
check('paiement validé → confirmation automatique', paid.data.paymentStatus === 'paid' && paid.data.orderStatus === 'processing' && paid.data.invoice.status === 'paid', paid.data);
check('reliquat en précommande', paid.data.items[0].backorderedQuantity === 2, paid.data.items[0]);
const shipEarly = await call('POST', `/store/admin/orders/${pre.data.reference}/ship`, { token: admin, body: { carrier: 'Moto', trackingNumber: 'M1' } });
check('expédition bloquée tant que le stock manque', shipEarly.status === 409, shipEarly.data);
await call('POST', '/store/admin/inventory/operations', { token: admin, body: { variantId: fmc.id, warehouseId: goma.id, type: 'restock', quantity: 3 } });
const shipLate = await call('POST', `/store/admin/orders/${pre.data.reference}/ship`, { token: admin, body: { carrier: 'Moto', trackingNumber: 'M1' } });
check('expédition après réapprovisionnement', shipLate.data.orderStatus === 'shipped' && stockOf('DJI-M4P-FMC') === '1/0/low_stock', [shipLate.data.orderStatus, stockOf('DJI-M4P-FMC')]);

const pixel = (await call('GET', '/store/products/google-pixel-8-pro')).data.variants[0];
const before = stockOf(pixel.sku);
await call('POST', '/store/cart/items', { token, body: { variantId: pixel.id, quantity: 1 } });
const toCancel = (await call('POST', '/store/orders', { token, body: { address, paymentMethod: 'cash_on_delivery' } })).data.reference;
await call('POST', `/store/admin/orders/${toCancel}/confirm`, { token: admin });
const cancelled = await call('POST', `/store/admin/orders/${toCancel}/cancel`, { token: admin, body: { reason: 'Client injoignable' } });
check('annulation → stock libéré, facture annulée', cancelled.data.orderStatus === 'cancelled' && cancelled.data.invoice.status === 'void' && stockOf(pixel.sku) === before, [cancelled.data.orderStatus, cancelled.data.invoice?.status, before, stockOf(pixel.sku)]);
const invoices = (await call('GET', '/store/admin/invoices', { token: admin })).data;
check('numérotation continue des factures', invoices.map((i) => i.invoiceNumber).sort().join(',') === 'INV-000001,INV-000002,INV-000003', invoices.map((i) => i.invoiceNumber));

console.log(`\n${passed} vérifications réussies, ${failures.length} échec(s)`);
if (failures.length) { console.log(failures.map((f) => ` - ${f}`).join('\n')); process.exit(1); }
