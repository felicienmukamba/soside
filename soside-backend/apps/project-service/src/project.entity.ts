import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import type { Point } from 'geojson';
import { ProjectCategory } from './project-category.entity';
import { ProjectTag } from './project-tag.entity';
import { ProjectMedia } from './project-media.entity';
import { Location } from './location.entity';
import { ProjectStatus } from './enums/project-status.enum';

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    clientName: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column('text', { array: true })
    techStack: string[];

    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.IN_PROGRESS,
    })
    status: ProjectStatus;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    })
    location: Point;

    @Column()
    region: string;

    @ManyToOne(() => Location, (location) => location.projects, { nullable: true })
    locationDetails: Location;

    @Column({ nullable: true })
    locationId: string;

    @ManyToMany(() => ProjectCategory, (category) => category.projects)
    @JoinTable()
    categories: ProjectCategory[];

    @ManyToMany(() => ProjectTag, (tag) => tag.projects)
    @JoinTable()
    tags: ProjectTag[];

    @OneToMany(() => ProjectMedia, (media) => media.project)
    media: ProjectMedia[];

    @CreateDateColumn()
    createdAt: Date;
}
