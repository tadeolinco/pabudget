import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm/browser'
import { Account } from './Account'
import { Budget } from './Budget'

@Entity('budgetTransaction')
export class BudgetTransaction {
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

  @ManyToOne(type => Account, account => account.transactionsToBudgets, {
    onDelete: 'SET NULL',
  })
  fromAccount: Account

  @ManyToOne(type => Budget, budget => budget.transactionsFromAccounts, {
    onDelete: 'SET NULL',
  })
  toBudget: Budget
}
