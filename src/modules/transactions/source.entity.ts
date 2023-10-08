import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from '../users/user.entity'

@Table
export class Source extends Model<Source> {
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  card_pan: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  signature: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  userId: number

  @BelongsTo(() => User)
  user: User

  @Column({
    type: DataType.ENUM,
    values: ['deposit', 'share'],
    allowNull: false,
  })
  type: string
}
