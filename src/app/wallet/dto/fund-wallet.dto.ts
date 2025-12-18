import { IsNotEmpty, IsNumber, IsPositive, Min, IsOptional, IsString } from 'class-validator';

export class FundWalletDto {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Min(1)
    amount: number;

    @IsOptional()
    @IsString()
    idempotencyKey?: string;
}
