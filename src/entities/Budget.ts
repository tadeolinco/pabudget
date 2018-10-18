import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm/browser'
import { AccountTransaction } from './AccountTransaction'

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
    type => AccountTransaction,
    accountTransaction => accountTransaction.toItem
  )
  transactions: AccountTransaction[]
}
