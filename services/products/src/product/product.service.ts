import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductRequestDto, FindOneRequestDto } from './dto/product.dto';
import { CreateProductResponse, FindOneResponse } from './product.pb';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findOne({ id }: FindOneRequestDto): Promise<FindOneResponse> {
    const product: Product = await this.productRepository.findOneBy({ id });

    if (!product) {
      return {
        data: null,
        error: ['Product not found'],
        status: HttpStatus.NOT_FOUND,
      };
    }

    return { data: product, error: null, status: HttpStatus.OK };
  }

  async createProduct(
    payload: CreateProductRequestDto,
  ): Promise<CreateProductResponse> {
    const product: Product = new Product();

    product.name = payload.name;
    product.stock = payload.stock;
    product.price = payload.price;

    await this.productRepository.save(product);

    return { id: product.id, error: null, status: HttpStatus.OK };
  }

  // async decreaseStock({
  //   id,
  //   value,
  // }: DecreaseStockRequest): Promise<DecreaseStockResponse> {
  //   const product = await this.productRepository.findOneBy({ id });

  //   if (!product) {
  //     return { status: HttpStatus.NOT_FOUND, error: ['Product not found'] };
  //   }

  //   await this.productRepository.update(id, { stock: product.stock - value });

  //   return { status: HttpStatus.OK, error: null };
  // }
}
