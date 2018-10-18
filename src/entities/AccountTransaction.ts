import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm/browser'
import { Account } from './Account'
import { Budget } from './Budget'

@Entity('accountTransaction')
export class AccountTransaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  note: string

  @Column({ type: 'int' })
  amount: number

  @ManyToOne(type => Account, account => account.toTransactions)
  toAccount: Account

  @ManyToOne(type => Account, account => account.fromTransactions)
  fromAccount: Account

  @ManyToOne(type => Budget, budget => budget.transactions)
  toItem: Budget
}
