import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

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
}
