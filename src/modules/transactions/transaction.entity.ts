import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Wallet } from '../wallet/wallet.entity'
import { Source } from './source.entity'

@Table
export class Transaction extends Model<Transaction> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount: number

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  reference: string

  @ForeignKey(() => Wallet)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  walletId: number

  @BelongsTo(() => Wallet)
  wallet: Wallet

  @Column({
    type: DataType.ENUM,
    values: ['pending', 'confirmed'],
    allowNull: false,
  })
  status: string

  @Column({
    type: DataType.ENUM,
    values: ['debit', 'credit'],
    allowNull: false,
  })
  type: string

  @ForeignKey(() => Source)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sourceId: number

  @BelongsTo(() => Source)
  source: Source
}

