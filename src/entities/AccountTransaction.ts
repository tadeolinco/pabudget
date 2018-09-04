import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm/browser'
import { Account } from './Account'
import { BudgetItem } from './BudgetItem'

@Entity('accountTransaction')
export class AccountTransaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  note: string

  @Column({ type: 'int' })
  amount: number

  @ManyToOne(type => BudgetItem, budgetItem => budgetItem.transactions)
  item: BudgetItem

  @ManyToOne(type => Account, account => account.transactions)
  account: Account
}
