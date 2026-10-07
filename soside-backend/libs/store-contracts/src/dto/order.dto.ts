import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min,
    ValidateIf, ValidateNested,
} from 'class-validator';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../enums';

const PHONE = /^\+?[0-9 ]{8,20}$/;

// --- Panier ---

export class AddCartItemDto {
    @IsUUID()
    variantId: string;

    @IsInt()
    @Min(1)
    @Max(50)
    quantity: number;
}

export class UpdateCartItemDto {
    @IsInt()
    @Min(0) // 0 = retirer la ligne
    @Max(50)
    quantity: number;
}

// --- Adresses ---

export class AddressDto {
    @IsString()
    @IsOptional()
    @MaxLength(40)
    label?: string; // Maison, Bureau…

    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    fullName: string;

    @Matches(PHONE, { message: 'phone must be a valid phone number' })
    phone: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    line1: string; // avenue, numéro, quartier

    @IsString()
    @IsOptional()
    @MaxLength(255)
    line2?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    landmark?: string; // point de repère

    @IsBoolean()
    @IsOptional()
    isDefault?: boolean;
}

export class UpdateAddressDto extends PartialType(AddressDto) { }

// --- Tunnel de commande ---

export class CheckoutDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    // Adresse enregistrée (client connecté) ou nouvelle adresse.
    @IsUUID()
    @IsOptional()
    addressId?: string;

    @ValidateIf((o: CheckoutDto) => !o.addressId)
    @ValidateNested()
    @Type(() => AddressDto)
    address?: AddressDto;

    @IsBoolean()
    @IsOptional()
    saveAddress?: boolean;

    // Facturation : identique à la livraison si absente.
    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    billingAddress?: AddressDto;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    noteToSeller?: string;
}

export class OrderLookupDto {
    @IsString()
    @IsNotEmpty()
    reference: string;

    @Matches(PHONE, { message: 'phone must be a valid phone number' })
    phone: string;
}

// --- Back-office ---

export class OrderQueryDto {
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @IsEnum(PaymentStatus)
    @IsOptional()
    paymentStatus?: PaymentStatus;

    @IsString()
    @IsOptional()
    q?: string;
}

export class RecordPaymentDto {
    @IsString()
    @IsOptional()
    @MaxLength(40)
    provider?: string; // manual, mpesa, airtel, orange, stripe…

    @IsString()
    @IsOptional()
    @MaxLength(120)
    transactionRef?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsOptional()
    amount?: number;
}

export class ShipOrderDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    carrier: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    trackingNumber: string;
}

export class CancelOrderDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    reason: string;
}
