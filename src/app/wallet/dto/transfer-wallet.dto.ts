import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class TransferWalletDto {
    @IsString()
    @IsNotEmpty()
    receiverWalletId: string;

    @IsNumber()
    @IsPositive()
    amount: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsString()
    idempotencyKey?: string;
}
