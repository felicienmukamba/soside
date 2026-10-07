export enum ProductStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

export enum ProductCondition {
    NEW = 'new',
    REFURBISHED = 'refurbished',
}

// Type de valeur d'un attribut de variante (axe de la matrice : couleur, taille, stockage…).
export enum DataType {
    TEXT = 'text',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    COLOR = 'color',
}

export enum StockStatus {
    IN_STOCK = 'in_stock',
    LOW_STOCK = 'low_stock',
    OUT_OF_STOCK = 'out_of_stock',
}

export enum MovementType {
    RESTOCK = 'restock', // entrée fournisseur (+ physique)
    RETURN = 'return', // retour client (+ physique)
    ADJUSTMENT = 'adjustment', // inventaire : physique fixé à la quantité comptée
    DAMAGE = 'damage', // casse, vol, perte (- physique)
    SALE = 'sale', // expédition (- physique, - réservé)
    TRANSFER_OUT = 'transfer_out',
    TRANSFER_IN = 'transfer_in',
    RESERVATION = 'reservation', // commande confirmée (+ réservé, physique inchangé)
    RELEASE = 'release', // commande annulée (- réservé, physique inchangé)
}

export enum MovementReferenceType {
    ORDER = 'order',
    PURCHASE = 'purchase',
    TRANSFER = 'transfer',
    MANUAL = 'manual',
}

export enum OrderStatus {
    PENDING = 'pending', // créée, en attente de paiement ou de confirmation
    PROCESSING = 'processing', // confirmée, stock réservé, en préparation
    SHIPPED = 'shipped',
    COMPLETED = 'completed', // livrée
    CANCELLED = 'cancelled',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum PaymentMethod {
    CASH_ON_DELIVERY = 'cash_on_delivery',
    MOBILE_MONEY = 'mobile_money',
    CARD = 'card',
}

export enum InvoiceStatus {
    DRAFT = 'draft',
    ISSUED = 'issued',
    PAID = 'paid',
    VOID = 'void',
}
