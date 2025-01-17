import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/oder.enum";

export class CreateOrderDto {

    @IsNumber()
    @IsPositive()
    totalAmount: number;

    @IsNumber()
    @IsPositive()
    totalItems: number;

    @IsEnum(OrderStatusList, {
        message: `Possible status values are ${OrderStatusList.join(', ')}`
    })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDING;

    @IsBoolean()
    @IsOptional()
    paid: boolean = false;
}
