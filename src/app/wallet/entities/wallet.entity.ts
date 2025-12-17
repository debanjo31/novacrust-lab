import { User } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    balance: number;

    @Column({ default: 'USD' })
    currency: string;

    @OneToOne(() => User, (user) => user.wallet)
    user: User;
}
