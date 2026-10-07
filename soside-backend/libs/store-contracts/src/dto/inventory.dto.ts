import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, ValidateNested } from 'class-validator';
import { MovementType } from '../enums';

export class WarehouseAddressDto {
    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    line1: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    line2?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    landmark?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}

export class CreateWarehouseDto {
    @Matches(/^[A-Z0-9-]{2,12}$/, { message: 'code must be 2-12 uppercase letters, digits or -' })
    code: string; // ex: GOMA-01

    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    name: string;

    @ValidateNested()
    @Type(() => WarehouseAddressDto)
    address: WarehouseAddressDto;

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean; // entrepôt servi en premier lors des réservations

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) { }

export const MANUAL_MOVEMENTS = [MovementType.RESTOCK, MovementType.RETURN, MovementType.ADJUSTMENT, MovementType.DAMAGE] as const;
export type ManualMovementType = (typeof MANUAL_MOVEMENTS)[number];

export class StockOperationDto {
    @IsUUID()
    variantId: string;

    @IsUUID()
    warehouseId: string;

    @IsIn(MANUAL_MOVEMENTS)
    type: ManualMovementType;

    // RESTOCK / RETURN / DAMAGE : quantité mouvementée. ADJUSTMENT : quantité physique comptée.
    @IsInt()
    @Min(0)
    @Max(100000)
    quantity: number;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    reason?: string;

    @IsString()
    @IsOptional()
    @MaxLength(80)
    referenceId?: string; // n° de bon d'achat, de retour…
}

export class InventorySettingsDto {
    @IsUUID()
    variantId: string;

    @IsUUID()
    warehouseId: string;

    @IsString()
    @IsOptional()
    @MaxLength(80)
    binLocation?: string | null; // ex: Rayon A, Étagère 2

    @IsInt()
    @Min(0)
    @IsOptional()
    reorderLevel?: number;
}

export class StockTransferDto {
    @IsUUID()
    variantId: string;

    @IsUUID()
    fromWarehouseId: string;

    @IsUUID()
    toWarehouseId: string;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    reason?: string;
}

export class InventoryQueryDto {
    @IsUUID()
    @IsOptional()
    warehouseId?: string;

    @IsString()
    @IsOptional()
    q?: string;

    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    @IsOptional()
    lowStock?: boolean;
}

export class MovementQueryDto {
    @IsUUID()
    @IsOptional()
    variantId?: string;

    @IsUUID()
    @IsOptional()
    warehouseId?: string;

    @IsEnum(MovementType)
    @IsOptional()
    type?: MovementType;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(500)
    @IsOptional()
    limit?: number;
}
