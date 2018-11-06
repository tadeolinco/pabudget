import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm/browser'
import { AccountTransaction } from './AccountTransaction'
import { BudgetTransaction } from './BudgetTransaction'

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  order: number

  @OneToMany(
    type => AccountTransaction,
    accountTransaction => accountTransaction.toAccount
  )
  transactionsFromAccounts: AccountTransaction[]

  @OneToMany(
    type => AccountTransaction,
    accountTransaction => accountTransaction.fromAccount
  )
  transactionsToAccounts: AccountTransaction[]

  @OneToMany(type => BudgetTransaction, transaction => transaction.fromAccount)
  transactionsToBudgets: BudgetTransaction[]
}
