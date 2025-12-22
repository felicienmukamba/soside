import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { MediaType } from './enums/media-type.enum';

@Entity()
export class ProjectMedia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({
        type: 'enum',
        enum: MediaType,
    })
    type: MediaType;

    @Column({ default: false })
    isMain: boolean;

    @ManyToOne(() => Project, (project) => project.media)
    project: Project;

    @Column()
    projectId: string;
}
