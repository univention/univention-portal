import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;
 
  @Column()
  property_1: string;
 
  @Column()
  property_2: string;
 
  @Column()
  property_3: string;
}
