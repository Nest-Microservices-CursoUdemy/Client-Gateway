import { BadRequestException, Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config';
import { PaginationDto } from '../common/';
import { catchError, firstValueFrom, pipe } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  async findAll(@Query() PaginationDto: PaginationDto) {
    try {
      return await this.productsClient.send({ cmd: 'find_all_products' }, PaginationDto);
    } catch (error) {
      console.error('Error connecting to microservice:', error); 
      throw new InternalServerErrorException('Error connecting to microservice(products.controller.ts)');
    }
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsClient
      .send({ cmd: 'find_one_product' }, { id: id })
      .pipe(
        catchError(err => { throw new RpcException(err); })
      );

    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id: id })
    //   );
    //   return product;
    // } catch (error) {
    //   // console.error('Error connecting to microservice:', error);
    //   // throw new BadRequestException(`Product with id ${id} not found`);
    //   throw new RpcException(error);
    // }
  }


  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number){
    return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }

  @Patch(':id')
  updateOne(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id', new ParseIntPipe()) id: number // Convertimos el id a un int
  ) {
    return this.productsClient.send({ cmd: 'update_product' }, {
      id, ...updateProductDto
    }).pipe(
      catchError(err => {throw new RpcException(err)})
    )
  }
  


}
