import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsArray, IsUUID, IsNumber } from 'class-validator';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    summary?: string;

    @IsString()
    @IsOptional()
    coverImage?: string;

    @IsNumber()
    @IsOptional()
    readingTime?: number;

    @IsString()
    @IsNotEmpty()
    authorId: string;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    categoryIds?: string[];

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    tagIds?: string[];

    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}
