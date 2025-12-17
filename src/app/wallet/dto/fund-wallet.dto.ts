import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class FundWalletDto {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    @Min(1)
    amount: number;
}
