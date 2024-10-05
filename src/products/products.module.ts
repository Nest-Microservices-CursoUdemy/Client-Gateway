import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCT_SERVICE } from 'src/config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ClientsModule.register([
      
      { // Aqui se conecta al microservicio de productos
        name: PRODUCT_SERVICE, 
        transport: Transport.TCP,
        options:{
          host: envs.productsMicroserviceHost,
          port: envs.productsMicroservicePort
        } 
      },
      
    ])
  ]
})
export class ProductsModule {}
