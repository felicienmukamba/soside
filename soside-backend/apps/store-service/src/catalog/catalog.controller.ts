import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AdminProductQueryDto, CreateBrandDto, CreateCategoryDto, CreateProductDto, ProductQueryDto, SetImagesDto, SetVariantsDto, STORE,
  UpdateBrandDto, UpdateCategoryDto, UpdateProductDto,
} from '@app/store-contracts';
import { CatalogService } from './catalog.service';
import { loadSettings } from '../common/helpers';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) { }

  @MessagePattern(STORE.settings)
  settings() {
    return loadSettings();
  }

  // --- Public ---

  @MessagePattern(STORE.categoryTree)
  categoryTree() {
    return this.catalogService.categoryTree();
  }

  @MessagePattern(STORE.brands)
  brands() {
    return this.catalogService.findBrands();
  }

  @MessagePattern(STORE.products)
  products(@Payload() query: ProductQueryDto) {
    return this.catalogService.findProducts(query);
  }

  @MessagePattern(STORE.product)
  product(@Payload() slug: string) {
    return this.catalogService.findProduct(slug);
  }

  // --- Taxonomie ---

  @MessagePattern(STORE.adminCategories)
  adminCategories() {
    return Promise.all([this.catalogService.categoryTree(true), this.catalogService.findBrands(true)])
      .then(([categories, brands]) => ({ categories, brands }));
  }

  @MessagePattern(STORE.createCategory)
  createCategory(@Payload() dto: CreateCategoryDto) {
    return this.catalogService.createCategory(dto);
  }

  @MessagePattern(STORE.updateCategory)
  updateCategory(@Payload() data: { id: string; data: UpdateCategoryDto }) {
    return this.catalogService.updateCategory(data.id, data.data);
  }

  @MessagePattern(STORE.deleteCategory)
  deleteCategory(@Payload() id: string) {
    return this.catalogService.deleteCategory(id);
  }

  @MessagePattern(STORE.createBrand)
  createBrand(@Payload() dto: CreateBrandDto) {
    return this.catalogService.createBrand(dto);
  }

  @MessagePattern(STORE.updateBrand)
  updateBrand(@Payload() data: { id: string; data: UpdateBrandDto }) {
    return this.catalogService.updateBrand(data.id, data.data);
  }

  @MessagePattern(STORE.deleteBrand)
  deleteBrand(@Payload() id: string) {
    return this.catalogService.deleteBrand(id);
  }

  // --- Produits ---

  @MessagePattern(STORE.adminProducts)
  adminProducts(@Payload() query: AdminProductQueryDto) {
    return this.catalogService.adminProducts(query);
  }

  @MessagePattern(STORE.adminProduct)
  adminProduct(@Payload() id: string) {
    return this.catalogService.adminProduct(id);
  }

  @MessagePattern(STORE.createProduct)
  createProduct(@Payload() dto: CreateProductDto) {
    return this.catalogService.createProduct(dto);
  }

  @MessagePattern(STORE.updateProduct)
  updateProduct(@Payload() data: { id: string; data: UpdateProductDto }) {
    return this.catalogService.updateProduct(data.id, data.data);
  }

  @MessagePattern(STORE.setVariants)
  setVariants(@Payload() data: { id: string; data: SetVariantsDto }) {
    return this.catalogService.setVariants(data.id, data.data);
  }

  @MessagePattern(STORE.setImages)
  setImages(@Payload() data: { id: string; data: SetImagesDto }) {
    return this.catalogService.setImages(data.id, data.data);
  }
}
