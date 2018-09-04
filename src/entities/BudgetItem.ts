import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm/browser'
import { AccountTransaction } from './AccountTransaction'
import { BudgetGroup } from './BudgetGroup'

@Entity('budgetItem')
export class BudgetItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ type: 'int' })
  budget: number

  @ManyToOne(type => BudgetGroup, budgetGroup => budgetGroup.items)
  group: BudgetGroup

  @OneToMany(
    type => AccountTransaction,
    accountTransaction => accountTransaction.item
  )
  transactions: AccountTransaction[]
}
