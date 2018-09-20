import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm/browser';
import { BudgetItem } from './BudgetItem';

@Entity('budgetGroup')
export class BudgetGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  order: number;

  @OneToMany(type => BudgetItem, budgetItem => budgetItem.group)
  items: BudgetItem[];
}