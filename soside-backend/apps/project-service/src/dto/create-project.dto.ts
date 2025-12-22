import { IsString, IsArray, IsOptional, IsUrl, IsNotEmpty, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsString()
    @IsNotEmpty()
    type: 'Point';

    @IsArray()
    coordinates: number[]; // [longitude, latitude]
}

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @IsString({ each: true })
    techStack: string[];

    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => LocationDto)
    location?: LocationDto;

    @IsString()
    @IsNotEmpty()
    region: string;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    categoryIds?: string[];

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    tagIds?: string[];
}
