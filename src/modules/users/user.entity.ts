import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    first_name: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    last_name: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address: string

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    dob: Date

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    username: string

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string
}
