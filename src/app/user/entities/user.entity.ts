import { Wallet } from '../../wallet/entities/wallet.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Wallet, (wallet) => wallet.user)
    @JoinColumn({ name: 'wallet_id' })
    wallet: Wallet;

    //Other informations - address, phone number, etc
}
