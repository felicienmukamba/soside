import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionAction, PermissionSubject } from './enums/permission.enum';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: PermissionAction,
    })
    action: PermissionAction;

    @Column({
        type: 'enum',
        enum: PermissionSubject,
    })
    subject: PermissionSubject;

    @Column()
    role: string; // Which role has this permission
}
