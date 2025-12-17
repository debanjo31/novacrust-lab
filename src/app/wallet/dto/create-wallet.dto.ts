import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateWalletDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    currency?: string = 'USD';
}
