import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript'

import { User } from '../users/user.entity'

@Table
export class Wallet extends Model<Wallet> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    balance: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    previous_balance: number

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    reference: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number

    @BelongsTo(() => User)
    user: User
}
