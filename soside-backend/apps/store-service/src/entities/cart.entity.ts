import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

// Panier persistant : rattaché à un compte client (customerId) ou à une session invitée (sessionId).
@Entity('store_carts')
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { nullable: true, unique: true })
    customerId: string | null;

    @Column('uuid', { nullable: true, unique: true })
    sessionId: string | null;

    @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
    items: CartItem[];

    @Column({ type: 'timestamptz', default: () => 'now()' })
    lastActivity: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}

@Entity('store_cart_items')
@Unique(['cartId', 'variantId'])
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    cartId: string;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cartId' })
    cart: Cart;

    @Column('uuid')
    variantId: string;

    @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'variantId' })
    variant: ProductVariant;

    @Column()
    quantity: number;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}
