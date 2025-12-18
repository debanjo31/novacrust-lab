import { TransferStatus } from '../../../shared/constants';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Wallet, { nullable: true })
    @JoinColumn({ name: 'sender_wallet_id' })
    sender: Wallet;

    @ManyToOne(() => Wallet, { nullable: false })
    @JoinColumn({ name: 'receiver_wallet_id' })
    receiver: Wallet;

    @Column()
    type: string;

    @Column({ type: 'decimal', precision: 16, scale: 2 })
    amount: number;

    @Column()
    reference: string;

    @Column({
        type: 'enum',
        enum: TransferStatus,
        default: TransferStatus.LOCKED,
    })
    status: TransferStatus;

    @CreateDateColumn()
    transferDate: Date;

    @Column({ default: 'USD' })
    currency: string;
}
