import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional,
    IsString, IsUrl, IsUUID, Matches, Max, MaxLength, Min, ValidateNested,
} from 'class-validator';
import { DataType, ProductCondition, ProductStatus } from '../enums';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const toBoolean = ({ value }: { value: unknown }) => (value === 'true' || value === true ? true : value === 'false' || value === false ? false : value);

// --- Taxonomie ---

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    name: string;

    @Matches(SLUG, { message: 'slug must be kebab-case' })
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    iconUrl?: string | null;

    @IsUUID()
    @IsOptional()
    parentId?: string | null;

    @IsInt()
    @IsOptional()
    position?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    name: string;

    @Matches(SLUG, { message: 'slug must be kebab-case' })
    @IsOptional()
    slug?: string;

    @IsUrl({ require_tld: false })
    @IsOptional()
    website?: string | null;

    @IsString()
    @IsOptional()
    logoUrl?: string | null;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) { }

// --- Fiche produit parente ---

export class ProductOptionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    name: string; // ex: Couleur, Stockage

    @IsEnum(DataType)
    type: DataType;

    @IsArray()
    @ArrayMaxSize(30)
    @IsString({ each: true })
    values: string[];
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(160)
    name: string;

    @Matches(SLUG, { message: 'slug must be kebab-case' })
    @IsOptional()
    slug?: string;

    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @IsUUID()
    categoryId: string;

    @IsUUID()
    @IsOptional()
    brandId?: string | null;

    @IsEnum(ProductCondition)
    @IsOptional()
    condition?: ProductCondition;

    @IsString()
    @IsOptional()
    @MaxLength(300)
    shortDescription?: string;

    @IsString()
    @IsOptional()
    descriptionHtml?: string;

    @IsObject()
    @IsOptional()
    specs?: Record<string, string>;

    @IsArray()
    @ArrayMaxSize(5)
    @ValidateNested({ each: true })
    @Type(() => ProductOptionDto)
    @IsOptional()
    options?: ProductOptionDto[];

    @IsString()
    @IsOptional()
    @MaxLength(70)
    seoTitle?: string;

    @IsString()
    @IsOptional()
    @MaxLength(170)
    seoDescription?: string;

    @IsArray()
    @ArrayMaxSize(30)
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsBoolean()
    @IsOptional()
    isDigital?: boolean;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;
}

export class UpdateProductDto extends PartialType(CreateProductDto) { }

// --- Matrice des variantes ---

export class VariantInputDto {
    @IsUUID()
    @IsOptional()
    id?: string;

    @IsString()
    @Matches(/^[A-Z0-9][A-Z0-9-_.]{1,63}$/, { message: 'sku must be uppercase letters, digits, - _ .' })
    sku: string;

    @IsString()
    @IsOptional()
    @MaxLength(120)
    name?: string;

    @IsObject()
    attributes: Record<string, string>;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsOptional()
    compareAtPrice?: number | null; // prix barré

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsOptional()
    costPrice?: number | null; // prix de revient, pour la marge

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(100)
    @IsOptional()
    taxRate?: number; // TVA en %, incluse dans le prix de vente

    @IsNumber({ maxDecimalPlaces: 3 })
    @Min(0)
    @IsOptional()
    weightKg?: number;

    @Matches(/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?$/, { message: 'dimensionsLwh must look like 10x10x20' })
    @IsOptional()
    dimensionsLwh?: string | null;

    @IsString()
    @IsOptional()
    barcode?: string | null; // EAN / UPC

    @IsString()
    @IsOptional()
    mainImageUrl?: string | null;

    @IsInt()
    @Min(0)
    @IsOptional()
    stockAlertThreshold?: number;

    @IsBoolean()
    @IsOptional()
    allowBackorder?: boolean;

    @IsBoolean()
    @IsOptional()
    trackInventory?: boolean;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class SetVariantsDto {
    @IsArray()
    @ArrayMaxSize(200)
    @ValidateNested({ each: true })
    @Type(() => VariantInputDto)
    variants: VariantInputDto[];
}

export class ImageInputDto {
    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @IsString()
    @IsOptional()
    altText?: string;

    @IsUUID()
    @IsOptional()
    variantId?: string | null;
}

export class SetImagesDto {
    @IsArray()
    @ArrayMaxSize(30)
    @ValidateNested({ each: true })
    @Type(() => ImageInputDto)
    images: ImageInputDto[];
}

// --- Recherche catalogue ---

export const PRODUCT_SORTS = ['relevance', 'popular', 'newest', 'price_asc', 'price_desc'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export class ProductQueryDto {
    @IsString()
    @IsOptional()
    category?: string; // slug, inclut les sous-catégories

    @IsString()
    @IsOptional()
    brand?: string; // slug

    @IsEnum(ProductCondition)
    @IsOptional()
    condition?: ProductCondition;

    @Transform(toBoolean)
    @IsBoolean()
    @IsOptional()
    promo?: boolean;

    @Transform(toBoolean)
    @IsBoolean()
    @IsOptional()
    featured?: boolean;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    q?: string;

    @IsIn(PRODUCT_SORTS)
    @IsOptional()
    sort?: ProductSort;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    limit?: number;
}

export class AdminProductQueryDto {
    @IsEnum(ProductStatus)
    @IsOptional()
    status?: ProductStatus;

    @IsString()
    @IsOptional()
    q?: string;
}
