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

  @OneToMany(type => AccountTransaction, transaction => transaction.fromAccount)
  fromTransactions: AccountTransaction[]

  @OneToMany(type => AccountTransaction, transaction => transaction.toAccount)
  toTransactions: AccountTransaction[]
}
