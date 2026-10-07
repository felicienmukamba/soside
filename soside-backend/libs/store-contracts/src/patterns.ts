// Noms des messages Redis échangés entre la gateway et store-service.
export const STORE = {
    settings: 'store_get_settings',

    // Catalogue public
    categoryTree: 'store_category_tree',
    brands: 'store_find_brands',
    products: 'store_find_products',
    product: 'store_find_product',

    // Taxonomie (admin)
    adminCategories: 'store_admin_categories',
    createCategory: 'store_create_category',
    updateCategory: 'store_update_category',
    deleteCategory: 'store_delete_category',
    createBrand: 'store_create_brand',
    updateBrand: 'store_update_brand',
    deleteBrand: 'store_delete_brand',

    // Produits (admin)
    adminProducts: 'store_admin_products',
    adminProduct: 'store_admin_product',
    createProduct: 'store_create_product',
    updateProduct: 'store_update_product',
    setVariants: 'store_set_variants',
    setImages: 'store_set_images',

    // Logistique (admin)
    warehouses: 'store_find_warehouses',
    createWarehouse: 'store_create_warehouse',
    updateWarehouse: 'store_update_warehouse',
    inventory: 'store_find_inventory',
    stockOperation: 'store_stock_operation',
    stockTransfer: 'store_stock_transfer',
    inventorySettings: 'store_inventory_settings',
    movements: 'store_find_movements',

    // Panier
    getCart: 'store_get_cart',
    addCartItem: 'store_add_cart_item',
    updateCartItem: 'store_update_cart_item',
    mergeCart: 'store_merge_cart',

    // Adresses
    addresses: 'store_find_addresses',
    createAddress: 'store_create_address',
    updateAddress: 'store_update_address',
    deleteAddress: 'store_delete_address',

    // Commandes
    checkout: 'store_checkout',
    myOrders: 'store_my_orders',
    myOrder: 'store_my_order',
    lookupOrder: 'store_lookup_order',
    adminOrders: 'store_admin_orders',
    adminOrder: 'store_admin_order',
    confirmOrder: 'store_confirm_order',
    recordPayment: 'store_record_payment',
    shipOrder: 'store_ship_order',
    deliverOrder: 'store_deliver_order',
    cancelOrder: 'store_cancel_order',

    // Factures
    adminInvoices: 'store_admin_invoices',
    invoice: 'store_find_invoice',
} as const;

// Panier : client connecté (userId) ou invité (sessionId généré par le front).
export interface CartOwner {
    userId?: string;
    sessionId?: string;
}

// Utilisateur à l'origine d'une action (journal des mouvements).
export interface Actor {
    actorId?: string;
}

// Format d'erreur renvoyé par store-service (RpcException), traduit en HTTP par la gateway.
export interface StoreRpcError {
    statusCode: number;
    message: string | string[];
}
