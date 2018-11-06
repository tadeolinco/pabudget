import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm/browser'
import { BudgetTransaction } from './BudgetTransaction'

@Entity('budget')
export class Budget {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  order: number

  @Column({ type: 'int', default: 0 })
  amount: number

  @OneToMany(
    type => BudgetTransaction,
    budgetTransaction => budgetTransaction.toBudget
  )
  transactionsFromAccounts: BudgetTransaction[]
}
