import {
    BadRequestException, Body, Controller, Delete, Get, Headers, HttpCode, Inject, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    AddCartItemDto, AddressDto, CartOwner, CheckoutDto, OrderLookupDto, ProductQueryDto, STORE, UpdateAddressDto, UpdateCartItemDto,
} from '@app/store-contracts';
import { CurrentUser, JwtAuthGuard, OptionalAuthGuard } from '../auth/jwt';
import type { AuthUser } from '../auth/jwt';
import { rpc } from '../common/rpc';

const SESSION = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Panier du client connecté, sinon panier invité identifié par l'en-tête x-cart-session (UUID généré par le front).
function cartOwner(user: AuthUser | undefined, session: string | undefined): CartOwner {
    if (user) return { userId: user.id };
    if (session && SESSION.test(session)) return { sessionId: session };
    throw new BadRequestException('En-tête x-cart-session manquant ou invalide');
}

@ApiTags('store')
@Controller('store')
export class StoreController {
    constructor(@Inject('STORE_SERVICE') private readonly storeClient: ClientProxy) { }

    // ===================== Catalogue =====================

    @Get('settings')
    @ApiOperation({ summary: 'Currency, delivery cities and shipping fees' })
    settings() {
        return rpc(this.storeClient, STORE.settings);
    }

    @Get('categories')
    @ApiOperation({ summary: 'Category tree (active categories only)' })
    categories() {
        return rpc(this.storeClient, STORE.categoryTree);
    }

    @Get('brands')
    @ApiOperation({ summary: 'Active brands' })
    brands() {
        return rpc(this.storeClient, STORE.brands);
    }

    @Get('products')
    @ApiOperation({ summary: 'Search published products (category includes sub-categories)' })
    products(@Query() query: ProductQueryDto) {
        return rpc(this.storeClient, STORE.products, query);
    }

    @Get('products/:slug')
    @ApiOperation({ summary: 'Product page: variants, availability, gallery, breadcrumb' })
    product(@Param('slug') slug: string) {
        return rpc(this.storeClient, STORE.product, slug);
    }

    // ===================== Panier =====================

    @Get('cart')
    @UseGuards(OptionalAuthGuard)
    @ApiHeader({ name: 'x-cart-session', required: false, description: 'Guest cart UUID' })
    @ApiOperation({ summary: 'Current cart with live prices and stock issues' })
    cart(@CurrentUser() user: AuthUser | undefined, @Headers('x-cart-session') session?: string) {
        return rpc(this.storeClient, STORE.getCart, { owner: cartOwner(user, session) });
    }

    @Post('cart/items')
    @UseGuards(OptionalAuthGuard)
    @ApiHeader({ name: 'x-cart-session', required: false })
    @ApiOperation({ summary: 'Add a variant to the cart' })
    addToCart(@CurrentUser() user: AuthUser | undefined, @Headers('x-cart-session') session: string | undefined, @Body() dto: AddCartItemDto) {
        return rpc(this.storeClient, STORE.addCartItem, { owner: cartOwner(user, session), data: dto });
    }

    @Patch('cart/items/:variantId')
    @UseGuards(OptionalAuthGuard)
    @ApiHeader({ name: 'x-cart-session', required: false })
    @ApiOperation({ summary: 'Change a cart line quantity (0 removes it)' })
    updateCartItem(
        @CurrentUser() user: AuthUser | undefined,
        @Headers('x-cart-session') session: string | undefined,
        @Param('variantId', ParseUUIDPipe) variantId: string,
        @Body() dto: UpdateCartItemDto,
    ) {
        return rpc(this.storeClient, STORE.updateCartItem, { owner: cartOwner(user, session), variantId, quantity: dto.quantity });
    }

    @Post('cart/merge')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiHeader({ name: 'x-cart-session', required: true })
    @ApiOperation({ summary: 'After login: merge the guest cart into the customer cart' })
    mergeCart(@CurrentUser() user: AuthUser, @Headers('x-cart-session') session?: string) {
        if (!session || !SESSION.test(session)) throw new BadRequestException('En-tête x-cart-session manquant ou invalide');
        return rpc(this.storeClient, STORE.mergeCart, { userId: user.id, sessionId: session });
    }

    // ===================== Commandes =====================

    @Post('orders')
    @UseGuards(OptionalAuthGuard)
    @ApiHeader({ name: 'x-cart-session', required: false })
    @ApiOperation({ summary: 'Checkout: turn the cart into an order (prices and stock re-checked server-side)' })
    checkout(@CurrentUser() user: AuthUser | undefined, @Headers('x-cart-session') session: string | undefined, @Body() dto: CheckoutDto) {
        return rpc(this.storeClient, STORE.checkout, { owner: cartOwner(user, session), data: dto });
    }

    @Get('orders/lookup')
    @ApiOperation({ summary: 'Guest order tracking (reference + delivery phone)' })
    lookup(@Query() dto: OrderLookupDto) {
        return rpc(this.storeClient, STORE.lookupOrder, dto);
    }

    // ===================== Espace client =====================

    @Get('me/orders')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Order history with payment and delivery status' })
    myOrders(@CurrentUser() user: AuthUser) {
        return rpc(this.storeClient, STORE.myOrders, { userId: user.id });
    }

    @Get('me/orders/:reference')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    myOrder(@CurrentUser() user: AuthUser, @Param('reference') reference: string) {
        return rpc(this.storeClient, STORE.myOrder, { userId: user.id, reference });
    }

    @Get('me/invoices/:invoiceNumber')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    myInvoice(@CurrentUser() user: AuthUser, @Param('invoiceNumber') invoiceNumber: string) {
        return rpc(this.storeClient, STORE.invoice, { invoiceNumber, customerId: user.id });
    }

    @Get('me/addresses')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    addresses(@CurrentUser() user: AuthUser) {
        return rpc(this.storeClient, STORE.addresses, { userId: user.id });
    }

    @Post('me/addresses')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    createAddress(@CurrentUser() user: AuthUser, @Body() dto: AddressDto) {
        return rpc(this.storeClient, STORE.createAddress, { userId: user.id, data: dto });
    }

    @Patch('me/addresses/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    updateAddress(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAddressDto) {
        return rpc(this.storeClient, STORE.updateAddress, { userId: user.id, id, data: dto });
    }

    @Delete('me/addresses/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    deleteAddress(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string) {
        return rpc(this.storeClient, STORE.deleteAddress, { userId: user.id, id });
    }
}
