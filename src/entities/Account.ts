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

  @Column()
  name: string

  @OneToMany(
    type => AccountTransaction,
    accountTransaction => accountTransaction.account
  )
  transactions: AccountTransaction[]
}
