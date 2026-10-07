import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

// Adresse : carnet d'un client (userId issu de auth-service) ou adresse d'un entrepôt (userId null).
@Entity('store_addresses')
@Index(['userId'])
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { nullable: true })
    userId: string | null;

    @Column({ type: 'varchar', nullable: true })
    label: string | null;

    @Column({ type: 'varchar', nullable: true })
    fullName: string | null;

    @Column({ type: 'varchar', nullable: true })
    phone: string | null;

    @Column()
    city: string;

    @Column()
    line1: string;

    @Column({ type: 'varchar', nullable: true })
    line2: string | null;

    @Column({ type: 'varchar', nullable: true })
    landmark: string | null;

    @Column({ default: false })
    isDefault: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
