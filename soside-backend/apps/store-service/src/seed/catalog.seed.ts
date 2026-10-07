import { DataType, ProductCondition } from '@app/store-contracts';

// Catalogue de démarrage, inséré par `npm run db:setup` (ou au premier lancement d'un microservice) si aucune catégorie n'existe.
// Les images sont servies par le site boutique (dossier public/products). Désactivable : STORE_SEED=false.

export const seedCategories: { slug: string; name: string; parent?: string; description?: string }[] = [
    { slug: 'laptops', name: 'Laptops & PC', description: 'Ultrabooks, convertibles 2-en-1 et stations pro' },
    { slug: 'ultrabooks', name: 'Ultrabooks & Pro', parent: 'laptops' },
    { slug: 'convertibles', name: 'Convertibles 2-en-1', parent: 'laptops' },
    { slug: 'smartphones', name: 'Smartphones', description: 'iPhone, Google Pixel, Samsung Galaxy' },
    { slug: 'gadgets', name: 'Accessoires & Écrans', description: 'AirPods, écrans portables, sacoches et docks' },
    { slug: 'audio', name: 'Audio', parent: 'gadgets' },
    { slug: 'ecrans', name: 'Écrans portables', parent: 'gadgets' },
    { slug: 'sacoches', name: 'Sacoches & protection', parent: 'gadgets' },
];

export const seedWarehouses = [
    { code: 'GOMA-01', name: 'Dépôt Goma', city: 'Goma', line1: 'Boulevard Kanyamuhanga' },
    { code: 'BKV-01', name: 'Dépôt Bukavu', city: 'Bukavu', line1: 'Avenue Patrice Lumumba' },
];

export interface SeedProduct {
    slug: string;
    name: string;
    brand: string | null;
    category: string;
    condition: ProductCondition;
    rating: number;
    soldCount: number;
    isFeatured: boolean;
    descriptionShort: string;
    descriptionHtml: string;
    specs: Record<string, string>;
    options: { name: string; type: DataType; values: string[] }[];
    tags: string[];
    seoTitle: string | null;
    seoDescription: string | null;
    images: { imageUrl: string; altText: string | null }[];
    variants: {
        sku: string;
        name: string;
        attributes: Record<string, string>;
        price: number;
        compareAtPrice: number | null;
        weightKg: number;
        dimensionsLwh: string | null;
        mainImageUrl: string | null;
        stock: number;
    }[];
}

export const seedProducts: SeedProduct[] = [
    {
        "slug": "hp-elitebook-840-g8",
        "name": "HP EliteBook 840 G8",
        "brand": "HP",
        "category": "ultrabooks",
        "condition": ProductCondition.REFURBISHED,
        "rating": 4.8,
        "soldCount": 142,
        "isFeatured": true,
        "descriptionShort": "Le laptop professionnel par excellence : châssis aluminium fin, Intel Core i7 11e gén, 16 Go RAM et SSD NVMe ultrarapide.",
        "descriptionHtml": "<p>Le <strong>HP EliteBook 840 G8</strong> est conçu pour les professionnels exigeants. Alliant robustesse militaire MIL-STD et légèreté, il offre des performances exceptionnelles grâce à son processeur Intel Core i7 de 11e génération et ses 16 Go de RAM. Idéal pour le multitâche intensif, la bureautique avancée et le travail nomade.</p>",
        "specs": {
            "Processeur": "Intel Core i7-1165G7 (4 cœurs, jusqu'à 4.7 GHz)",
            "Mémoire RAM": "16 Go DDR4 (extensible à 64 Go)",
            "Stockage": "512 Go SSD M.2 NVMe PCIe",
            "Écran": "14 pouces Full HD (1920 x 1080) antireflet IPS",
            "Carte graphique": "Intel Iris Xe Graphics",
            "Connectivité": "Wi-Fi 6, Bluetooth 5.0, 2x Thunderbolt 4 / USB-C, 2x USB 3.1, HDMI 2.0",
            "Sécurité": "Lecteur d'empreintes digitales, caméra IR Windows Hello, puce TPM 2.0",
            "Autonomie": "Jusqu'à 10 heures avec charge rapide 65W",
            "Poids": "1.32 kg",
            "Système d'exploitation": "Windows 11 Professionnel 64 bits"
        },
        "options": [
            {
                "name": "RAM",
                "type": DataType.TEXT,
                "values": [
                    "16 Go"
                ]
            },
            {
                "name": "Stockage",
                "type": DataType.TEXT,
                "values": [
                    "512 Go SSD",
                    "1 To SSD"
                ]
            }
        ],
        "tags": [
            "hp",
            "laptops",
            "ultrabook",
            "core-i7",
            "pro"
        ],
        "seoTitle": "HP EliteBook 840 G8 Core i7 16Go RAM au meilleur prix | SOSIDE",
        "seoDescription": "Achetez le HP EliteBook 840 G8 reconditionné état neuf. Garantie incluse, livraison rapide à Goma, Bukavu et Uvira.",
        "images": [
            {
                "imageUrl": "/products/hp-elitebook-840.png",
                "altText": "HP EliteBook 840 G8 sur son carton d'origine"
            },
            {
                "imageUrl": "/products/hp-elitebook-slim.png",
                "altText": "HP EliteBook vue de profil fin"
            },
            {
                "imageUrl": "/products/laptop-package.png",
                "altText": "Emballage protecteur haute sécurité"
            }
        ],
        "variants": [
            {
                "sku": "HP-840G8-16-512",
                "name": "16 Go RAM · 512 Go SSD",
                "attributes": {
                    "RAM": "16 Go",
                    "Stockage": "512 Go SSD"
                },
                "price": 520,
                "compareAtPrice": 620,
                "weightKg": 1.35,
                "dimensionsLwh": "32.3x21.5x1.79",
                "mainImageUrl": "/products/hp-elitebook-840.png",
                "stock": 10
            },
            {
                "sku": "HP-840G8-16-1TB",
                "name": "16 Go RAM · 1 To SSD",
                "attributes": {
                    "RAM": "16 Go",
                    "Stockage": "1 To SSD"
                },
                "price": 580,
                "compareAtPrice": 680,
                "weightKg": 1.35,
                "dimensionsLwh": "32.3x21.5x1.79",
                "mainImageUrl": "/products/hp-elitebook-840.png",
                "stock": 2
            }
        ]
    },
    {
        "slug": "hp-elitebook-x360-1040",
        "name": "HP EliteBook x360 1040 G8 2-in-1",
        "brand": "HP",
        "category": "convertibles",
        "condition": ProductCondition.REFURBISHED,
        "rating": 4.9,
        "soldCount": 84,
        "isFeatured": true,
        "descriptionShort": "Convertible ultra haut de gamme à 360°, écran tactile FHD IPS, Intel Core i7 vPro, finitions aluminium brossé.",
        "descriptionHtml": "<p>Passez du mode ordinateur au mode tablette ou chevalet en un geste. Le <strong>HP EliteBook x360 1040 G8</strong> allie la puissance d'un processeur Intel Core i7 vPro à la flexibilité d'un écran tactile rotatif à 360° et au son immersif Bang & Olufsen.</p>",
        "specs": {
            "Processeur": "Intel Core i7-1185G7 vPro",
            "Écran": "14 pouces FHD (1920 x 1080) Tactile Gorilla Glass convertible 360°",
            "Mémoire RAM": "16 Go LPDDR4x",
            "Stockage": "512 Go SSD NVMe",
            "Audio": "4 haut-parleurs Bang & Olufsen avec micros réducteurs de bruit",
            "Châssis": "Aluminium CNC unibody haute précision",
            "Autonomie": "Jusqu'à 12 heures",
            "Poids": "1.31 kg",
            "OS": "Windows 11 Pro"
        },
        "options": [],
        "tags": [
            "hp",
            "x360",
            "convertible",
            "tactile",
            "laptops"
        ],
        "seoTitle": "HP EliteBook x360 1040 Tactile | SOSIDE",
        "seoDescription": "PC Portable convertible 2-en-1 HP EliteBook x360 avec écran tactile rotatif et Core i7.",
        "images": [
            {
                "imageUrl": "/products/hp-elitebook-x360.png",
                "altText": "HP EliteBook x360 en mode tente sur bureau"
            },
            {
                "imageUrl": "/products/hp-elitebook-slim.png",
                "altText": "Châssis fin en aluminium"
            }
        ],
        "variants": [
            {
                "sku": "HP-X360-1040-16-512",
                "name": "Standard · 16 Go · 512 Go SSD",
                "attributes": {},
                "price": 650,
                "compareAtPrice": 750,
                "weightKg": 1.31,
                "dimensionsLwh": "31.9x20.2x1.66",
                "mainImageUrl": "/products/hp-elitebook-x360.png",
                "stock": 7
            }
        ]
    },
    {
        "slug": "dell-latitude-5320-2in1",
        "name": "Dell Latitude 5320 2-in-1",
        "brand": "Dell",
        "category": "convertibles",
        "condition": ProductCondition.REFURBISHED,
        "rating": 4.8,
        "soldCount": 96,
        "isFeatured": true,
        "descriptionShort": "Convertible 360° compact 13.3\" tactile, Intel Core i7 11e gén, fourni dans son carton Dell d'origine.",
        "descriptionHtml": "<p>Le <strong>Dell Latitude 5320 2-en-1</strong> est le compagnon idéal des professionnels mobiles : écran tactile 13.3\" Full HD, charnière rotative à 360 degrés, autonomie d'une journée complète et conception ultra-durable.</p>",
        "specs": {
            "Processeur": "Intel Core i7-1185G7",
            "Mémoire RAM": "16 Go DDR4",
            "Stockage": "512 Go SSD NVMe",
            "Écran": "13.3 pouces FHD (1920 x 1080) IPS Tactile 360°",
            "Connectique": "2x Thunderbolt 4 avec Power Delivery, 2x USB 3.2, HDMI 2.0, MicroSD",
            "Poids": "1.32 kg",
            "OS": "Windows 11 Professionnel"
        },
        "options": [],
        "tags": [
            "dell",
            "latitude",
            "2in1",
            "convertible",
            "laptops"
        ],
        "seoTitle": "Dell Latitude 5320 2-in-1 Tactile | SOSIDE",
        "seoDescription": "Dell Latitude 5320 tactile convertible 360° reconditionné certifié avec boîte d'origine.",
        "images": [
            {
                "imageUrl": "/products/dell-latitude-x360.png",
                "altText": "Dell Latitude 2-in-1 avec carton Dell"
            }
        ],
        "variants": [
            {
                "sku": "DELL-LAT-5320-16-512",
                "name": "Standard · 16 Go · 512 Go SSD",
                "attributes": {},
                "price": 490,
                "compareAtPrice": 560,
                "weightKg": 1.32,
                "dimensionsLwh": "30.5x20.7x1.69",
                "mainImageUrl": "/products/dell-latitude-x360.png",
                "stock": 5
            }
        ]
    },
    {
        "slug": "lenovo-thinkpad-x1-carbon",
        "name": "Lenovo ThinkPad X1 Carbon Gen 9",
        "brand": "Lenovo",
        "category": "ultrabooks",
        "condition": ProductCondition.REFURBISHED,
        "rating": 4.9,
        "soldCount": 110,
        "isFeatured": true,
        "descriptionShort": "Châssis en fibre de carbone ultra léger (1.13 kg), Intel Core i7 vPro, clavier rétroéclairé ergonomique avec TrackPoint.",
        "descriptionHtml": "<p>La référence absolue des ordinateurs portables d'affaires. Le <strong>Lenovo ThinkPad X1 Carbon</strong> associe une résistance certifiée selon 12 normes militaires à un poids plume de 1.13 kg et un écran 16:10 confortable.</p>",
        "specs": {
            "Processeur": "Intel Core i7-1165G7 vPro",
            "Mémoire": "16 Go LPDDR4x",
            "Stockage": "512 Go SSD PCIe 4.0 NVMe",
            "Écran": "14 pouces WUXGA (1920 x 1200) 16:10 IPS antireflet 400 nits",
            "Poids": "1.13 kg seulement",
            "Clavier": "Clavier résistant aux éclaboussures avec rétroéclairage et TrackPoint rouge",
            "OS": "Windows 11 Pro"
        },
        "options": [],
        "tags": [
            "lenovo",
            "thinkpad",
            "x1-carbon",
            "laptops"
        ],
        "seoTitle": "Lenovo ThinkPad X1 Carbon Gen 9 Core i7 | SOSIDE",
        "seoDescription": "Le fleuron ultraportable professionnel Lenovo ThinkPad X1 Carbon au meilleur prix.",
        "images": [
            {
                "imageUrl": "/products/thinkpad-x1.png",
                "altText": "Lenovo ThinkPad X1 Carbon en main avec TrackPoint"
            }
        ],
        "variants": [
            {
                "sku": "LEN-TP-X1-16-512",
                "name": "Standard · 16 Go · 512 Go SSD",
                "attributes": {},
                "price": 680,
                "compareAtPrice": 790,
                "weightKg": 1.13,
                "dimensionsLwh": "31.4x22.1x1.49",
                "mainImageUrl": "/products/thinkpad-x1.png",
                "stock": 4
            }
        ]
    },
    {
        "slug": "ecran-portable-ingnok-15",
        "name": "Écran Portable Ingnok 15.6\" FHD",
        "brand": "Ingnok",
        "category": "ecrans",
        "condition": ProductCondition.NEW,
        "rating": 4.8,
        "soldCount": 52,
        "isFeatured": true,
        "descriptionShort": "Moniteur portable Full HD IPS 1080p avec support rotatif 360°, double USB-C et Mini HDMI pour PC, Mac et consoles.",
        "descriptionHtml": "<p>Doublez votre productivité où que vous soyez avec l'<strong>Écran Portable Ingnok 15.6 pouces</strong>. Branchez-le en un seul câble USB-C sur votre laptop, smartphone ou console sans alimentation supplémentaire nécessaire.</p>",
        "specs": {
            "Taille de la dalle": "15.6 pouces (39.6 cm)",
            "Résolution": "Full HD 1920 x 1080 pixels à 60 Hz",
            "Technologie": "IPS grand angle 178°, filtre lumière bleue",
            "Connectique": "2x USB-C (DisplayPort + Charge), 1x Mini-HDMI, sortie jack 3.5mm",
            "Accessoires fournis": "Support métal réglable et rotatif 360°, câble Type-C vers Type-C, câble HDMI, alimentation",
            "Compatibilité": "Windows, macOS, Android, Nintendo Switch, PS5, Xbox",
            "Poids": "720 g"
        },
        "options": [],
        "tags": [
            "ecran",
            "moniteur",
            "portable",
            "gadgets",
            "usb-c"
        ],
        "seoTitle": "Écran Portable Ingnok 15.6 pouces FHD USB-C | SOSIDE",
        "seoDescription": "Deuxième écran portable pour laptop et gaming. Branchement plug-and-play USB-C.",
        "images": [
            {
                "imageUrl": "/products/ecran-portable-ingnok.png",
                "altText": "Écran portable Ingnok connecté sur support de bureau"
            }
        ],
        "variants": [
            {
                "sku": "INGNOK-156-FHD",
                "name": "Standard · 15.6 pouces",
                "attributes": {},
                "price": 135,
                "compareAtPrice": 165,
                "weightKg": 0.72,
                "dimensionsLwh": "36.2x22.8x0.9",
                "mainImageUrl": "/products/ecran-portable-ingnok.png",
                "stock": 15
            }
        ]
    },
    {
        "slug": "sacoche-ordinateur-dell-pro",
        "name": "Sacoche pour ordinateur Dell Pro 15.6\"",
        "brand": "Dell",
        "category": "sacoches",
        "condition": ProductCondition.NEW,
        "rating": 4.7,
        "soldCount": 160,
        "isFeatured": false,
        "descriptionShort": "Sacoche élégante et rembourrée avec bandoulière confort, compartiment anti-chocs et poches pour chargeurs.",
        "descriptionHtml": "<p>Transportez votre laptop en toute sécurité avec la <strong>Sacoche Dell Pro</strong>. Conçue avec un textile déperlant résistant aux éraflures et une doublure intérieure en mousse haute densité pour absorber les chocs.</p>",
        "specs": {
            "Compatibilité": "Tout ordinateur jusqu'à 15.6 pouces",
            "Matériau": "Polyester résistant et imperméable",
            "Rangements": "Compartiment laptop moussé + poches zippées accessoires et stylos",
            "Transport": "Poignée supérieure renforcée + bandoulière ajustable amovible",
            "Couleur": "Noir avec surpiqûres discrètes"
        },
        "options": [],
        "tags": [
            "dell",
            "sacoche",
            "accessoires",
            "gadgets"
        ],
        "seoTitle": "Sacoche pour ordinateur portable Dell Pro 15.6 pouces | SOSIDE",
        "seoDescription": "Protégez votre ordinateur avec la sacoche officielle Dell Pro disponible immédiatement.",
        "images": [
            {
                "imageUrl": "/products/dell-bag.png",
                "altText": "Sacoche noire Dell pour laptop avec bandoulière"
            }
        ],
        "variants": [
            {
                "sku": "DELL-BAG-PRO-15",
                "name": "Standard · 15.6 pouces",
                "attributes": {},
                "price": 35,
                "compareAtPrice": 45,
                "weightKg": 0.5,
                "dimensionsLwh": "40x30x6",
                "mainImageUrl": "/products/dell-bag.png",
                "stock": 30
            }
        ]
    },
    {
        "slug": "airpods-pro-2-usb-c",
        "name": "Apple AirPods Pro (2e génération, USB-C)",
        "brand": "Apple",
        "category": "audio",
        "condition": ProductCondition.NEW,
        "rating": 4.9,
        "soldCount": 290,
        "isFeatured": true,
        "descriptionShort": "Puce Apple H2, réduction active du bruit 2x plus efficace, boîtier MagSafe USB-C avec haut-parleur Localiser.",
        "descriptionHtml": "<p>Les <strong>AirPods Pro 2 avec port USB-C</strong> offrent une expérience sonore inégalée : Audio spatial personnalisé avec suivi dynamique de la tête, Réduction active du bruit ultra-performante et autonomie jusqu'à 30 heures avec le boîtier.</p>",
        "specs": {
            "Puce audio": "Apple H2 dans chaque écouteur, puce U1 dans le boîtier",
            "Réduction de bruit": "Active Pro 2x plus puissante + mode Transparence adaptative",
            "Connecteur de charge": "USB-C et sans fil MagSafe / Qi / chargeur Apple Watch",
            "Résistance": "Indice IP54 résistant à la poussière, à la transpiration et à l'eau",
            "Autonomie": "Jusqu'à 6h d'écoute sur une seule charge, 30h avec le boîtier",
            "Embouts": "4 tailles d'embouts en silicone doux (XS, S, M, L)"
        },
        "options": [],
        "tags": [
            "apple",
            "airpods",
            "audio",
            "gadgets"
        ],
        "seoTitle": "Apple AirPods Pro 2 USB-C Authentiques | SOSIDE",
        "seoDescription": "Achetez les AirPods Pro 2 USB-C neufs sous scellé avec garantie constructeur.",
        "images": [
            {
                "imageUrl": "/products/airpods-pro.png",
                "altText": "Boîtes neuves sous scellé Apple AirPods Pro"
            }
        ],
        "variants": [
            {
                "sku": "APPLE-AIRPODS-PRO-2-USBC",
                "name": "Standard · Blanc",
                "attributes": {},
                "price": 240,
                "compareAtPrice": 279,
                "weightKg": 0.25,
                "dimensionsLwh": "6x4.5x2.1",
                "mainImageUrl": "/products/airpods-pro.png",
                "stock": 25
            }
        ]
    },
    {
        "slug": "iphone-15-pro",
        "name": "iPhone 15 Pro",
        "brand": "Apple",
        "category": "smartphones",
        "condition": ProductCondition.NEW,
        "rating": 4.9,
        "soldCount": 210,
        "isFeatured": true,
        "descriptionShort": "Design en titane d'une résistance remarquable, puce A17 Pro ultra-puissante, bouton Action personnalisable, port USB-C.",
        "descriptionHtml": "<p>L'<strong>iPhone 15 Pro</strong> est forgé dans le titane de qualité aérospatiale, le rendant plus léger et plus résistant que jamais. Doté de la surpuissante puce A17 Pro gravée en 3 nanomètres, il offre des performances graphiques dignes d'une console de jeu et un système photo pro avec capteur principal 48 Mpx.</p>",
        "specs": {
            "Processeur": "Puce A17 Pro avec GPU 6 cœurs et Neural Engine 16 cœurs",
            "Écran": "Super Retina XDR OLED 6.1\" ProMotion 120 Hz, Always-On, Dynamic Island",
            "Appareil photo": "Principal 48 Mpx, Ultra grand-angle 12 Mpx, Téléobjectif 3x 12 Mpx",
            "Matériaux": "Châssis en titane, dos en verre mat texturé, Ceramic Shield à l'avant",
            "Connecteur": "USB-C compatible USB 3 (jusqu'à 10 Gbit/s)",
            "Autonomie": "Jusqu'à 23 heures de lecture vidéo",
            "Résistance": "Indice IP68 (jusqu'à 6 mètres pendant 30 minutes)"
        },
        "options": [
            {
                "name": "Capacité",
                "type": DataType.TEXT,
                "values": [
                    "128 Go",
                    "256 Go",
                    "512 Go"
                ]
            },
            {
                "name": "Couleur",
                "type": DataType.COLOR,
                "values": [
                    "Titane Naturel",
                    "Titane Noir"
                ]
            }
        ],
        "tags": [
            "apple",
            "iphone",
            "iphone-15-pro",
            "smartphones"
        ],
        "seoTitle": "iPhone 15 Pro Neuf au meilleur prix | SOSIDE Store",
        "seoDescription": "Achetez l'iPhone 15 Pro en RDC (Goma, Bukavu, Uvira). Paiement à la livraison, garantie 1 an.",
        "images": [],
        "variants": [
            {
                "sku": "IPHONE-15P-128-NAT",
                "name": "128 Go · Titane Naturel",
                "attributes": {
                    "Capacité": "128 Go",
                    "Couleur": "Titane Naturel"
                },
                "price": 990,
                "compareAtPrice": 1099,
                "weightKg": 0.187,
                "dimensionsLwh": "14.6x7.0x0.8",
                "mainImageUrl": null,
                "stock": 8
            },
            {
                "sku": "IPHONE-15P-256-NAT",
                "name": "256 Go · Titane Naturel",
                "attributes": {
                    "Capacité": "256 Go",
                    "Couleur": "Titane Naturel"
                },
                "price": 1090,
                "compareAtPrice": 1199,
                "weightKg": 0.187,
                "dimensionsLwh": "14.6x7.0x0.8",
                "mainImageUrl": null,
                "stock": 5
            },
            {
                "sku": "IPHONE-15P-512-NOIR",
                "name": "512 Go · Titane Noir",
                "attributes": {
                    "Capacité": "512 Go",
                    "Couleur": "Titane Noir"
                },
                "price": 1250,
                "compareAtPrice": 1399,
                "weightKg": 0.187,
                "dimensionsLwh": "14.6x7.0x0.8",
                "mainImageUrl": null,
                "stock": 2
            }
        ]
    },
    {
        "slug": "macbook-air-m2",
        "name": "Apple MacBook Air 13\" M2",
        "brand": "Apple",
        "category": "ultrabooks",
        "condition": ProductCondition.NEW,
        "rating": 4.9,
        "soldCount": 98,
        "isFeatured": true,
        "descriptionShort": "Puce Apple M2, écran Liquid Retina 13.6\", jusqu'à 18 heures d'autonomie dans un design ultra-fin de 1.24 kg.",
        "descriptionHtml": "<p>Redessiné autour de la puce M2 de nouvelle génération, le <strong>MacBook Air</strong> combine une vitesse foudroyante et une efficacité énergétique record dans un boîtier unibody en aluminium d'une finesse incomparable.</p>",
        "specs": {
            "Puce": "Apple M2 avec CPU 8 cœurs, GPU 8 cœurs, Neural Engine 16 cœurs",
            "Écran": "Liquid Retina 13.6 pouces rétroéclairé par LED avec technologie True Tone",
            "Mémoire unifiée": "8 Go ou 16 Go",
            "Stockage": "256 Go ou 512 Go SSD",
            "Recharge": "Port MagSafe 3 avec charge rapide, 2x ports Thunderbolt / USB 4",
            "Poids": "1.24 kg",
            "Autonomie": "Jusqu'à 18 heures"
        },
        "options": [
            {
                "name": "RAM",
                "type": DataType.TEXT,
                "values": [
                    "8 Go",
                    "16 Go"
                ]
            },
            {
                "name": "Stockage",
                "type": DataType.TEXT,
                "values": [
                    "256 Go SSD",
                    "512 Go SSD"
                ]
            },
            {
                "name": "Couleur",
                "type": DataType.TEXT,
                "values": [
                    "Minuit",
                    "Gris Sidéral"
                ]
            }
        ],
        "tags": [
            "apple",
            "macbook",
            "m2",
            "laptops"
        ],
        "seoTitle": "MacBook Air M2 13 pouces | SOSIDE Store",
        "seoDescription": "Apple MacBook Air M2 neuf sous scellé avec garantie Apple internationale.",
        "images": [],
        "variants": [
            {
                "sku": "MBA-M2-8-256-MIN",
                "name": "8 Go RAM · 256 Go SSD · Minuit",
                "attributes": {
                    "RAM": "8 Go",
                    "Stockage": "256 Go SSD",
                    "Couleur": "Minuit"
                },
                "price": 1050,
                "compareAtPrice": 1199,
                "weightKg": 1.24,
                "dimensionsLwh": "30.4x21.5x1.13",
                "mainImageUrl": null,
                "stock": 4
            },
            {
                "sku": "MBA-M2-16-512-MIN",
                "name": "16 Go RAM · 512 Go SSD · Gris Sidéral",
                "attributes": {
                    "RAM": "16 Go",
                    "Stockage": "512 Go SSD",
                    "Couleur": "Gris Sidéral"
                },
                "price": 1290,
                "compareAtPrice": 1450,
                "weightKg": 1.24,
                "dimensionsLwh": "30.4x21.5x1.13",
                "mainImageUrl": null,
                "stock": 2
            }
        ]
    },
    {
        "slug": "google-pixel-8-pro",
        "name": "Google Pixel 8 Pro",
        "brand": "Google",
        "category": "smartphones",
        "condition": ProductCondition.NEW,
        "rating": 4.8,
        "soldCount": 88,
        "isFeatured": true,
        "descriptionShort": "Puce Google Tensor G3, IA photo inégalée, écran Super Actua 120 Hz et 7 ans de mises à jour Android.",
        "descriptionHtml": "<p>Le <strong>Google Pixel 8 Pro</strong> est le smartphone Android le plus intelligent du marché. Grâce à l'IA de Google et au capteur photo de 50 Mpx, capturez des clichés spectaculaires même de nuit.</p>",
        "specs": {
            "Processeur": "Google Tensor G3 avec coprocesseur Titan M2",
            "Écran": "Super Actua LTPO OLED 6.7\" 1-120 Hz, 2400 nits de luminosité max",
            "Mémoire & Stockage": "12 Go RAM LPDDR5X, 128 Go / 256 Go UFS 3.1",
            "Appareil photo": "Grand angle 50 Mpx, Ultra grand-angle 48 Mpx avec macro, Téléobjectif 48 Mpx 5x",
            "Batterie": "5050 mAh avec recharge rapide 30W et recharge sans fil"
        },
        "options": [],
        "tags": [
            "google",
            "pixel",
            "smartphones"
        ],
        "seoTitle": "Google Pixel 8 Pro au meilleur prix | SOSIDE",
        "seoDescription": "Le smartphone photo de référence Google Pixel 8 Pro disponible avec garantie.",
        "images": [],
        "variants": [
            {
                "sku": "PIXEL-8PRO-12-128",
                "name": "Standard · 128 Go",
                "attributes": {},
                "price": 780,
                "compareAtPrice": 899,
                "weightKg": 0.213,
                "dimensionsLwh": "16.2x7.6x0.88",
                "mainImageUrl": null,
                "stock": 8
            }
        ]
    },
    {
        "slug": "samsung-galaxy-s24-ultra",
        "name": "Samsung Galaxy S24 Ultra",
        "brand": "Samsung",
        "category": "smartphones",
        "condition": ProductCondition.NEW,
        "rating": 4.9,
        "soldCount": 130,
        "isFeatured": true,
        "descriptionShort": "Galaxy AI embarquée, Snapdragon 8 Gen 3 for Galaxy, stylet S Pen intégré, zoom optique 5x et capteur 200 Mpx.",
        "descriptionHtml": "<p>Le monstre de puissance Samsung. Le <strong>Galaxy S24 Ultra</strong> redéfinit le smartphone premium avec son châssis en titane, son verre antireflet Gorilla Armor et la suite d'intelligence artificielle Galaxy AI.</p>",
        "specs": {
            "Processeur": "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4 nm)",
            "Écran": "Dynamic AMOLED 2X 6.8\" Quad HD+ 120 Hz plat avec Gorilla Armor antireflet",
            "Mémoire & Stockage": "12 Go RAM, 256 Go / 512 Go",
            "Appareil photo": "200 Mpx principal, 50 Mpx périscope 5x, 10 Mpx téléobjectif 3x, 12 Mpx ultra grand-angle",
            "Stylet": "S Pen inclus dans le châssis",
            "Batterie": "5000 mAh avec charge 45W"
        },
        "options": [],
        "tags": [
            "samsung",
            "galaxy",
            "s24-ultra",
            "smartphones"
        ],
        "seoTitle": "Samsung Galaxy S24 Ultra Titane | SOSIDE Store",
        "seoDescription": "Commandez le Samsung Galaxy S24 Ultra avec S Pen et Galaxy AI. Livraison offerte.",
        "images": [],
        "variants": [
            {
                "sku": "SAMS-S24U-12-256",
                "name": "Standard · 256 Go",
                "attributes": {},
                "price": 1120,
                "compareAtPrice": 1250,
                "weightKg": 0.232,
                "dimensionsLwh": "16.2x7.9x0.86",
                "mainImageUrl": null,
                "stock": 7
            }
        ]
    }
];
