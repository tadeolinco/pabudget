import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm/browser'
import { AccountTransaction } from './AccountTransaction'

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  name: number

  @OneToMany(
    type => AccountTransaction,
    accountTransaction => accountTransaction.account
  )
  transactions: AccountTransaction[]
}
