import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Transaction,
  CreateDateColumn,
} from 'typeorm/browser'
import { Account } from './Account'

@Entity('accountTransaction')
export class AccountTransaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  note: string

  @Column({ type: 'int' })
  amount: number

  @Column({ default: true })
  active: boolean

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(type => Account, account => account.transactionsToAccounts, {
    onDelete: 'SET NULL',
  })
  fromAccount: Account

  @ManyToOne(type => Account, account => account.transactionsFromAccounts, {
    onDelete: 'SET NULL',
  })
  toAccount: Account
}
