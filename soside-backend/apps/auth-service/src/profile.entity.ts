import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column('text', { nullable: true })
    bio: string;

    @Column({ nullable: true })
    location: string; // Goma, Kinshasa, Bukavu, etc.

    @Column({ nullable: true })
    phoneNumber: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User;

    @Column()
    userId: string;
}
