import {
  DataType,
  Column,
  Model,
  Table,
  BeforeSave,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import cryptoRandomString from 'crypto-random-string';

@Table({
  timestamps: true,
  tableName: 'users',
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    autoIncrement: false,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    unique: true,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column(DataType.STRING)
  image: string;

  @Column(DataType.STRING)
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'user',
  })
  role: string;

  @Column(DataType.STRING)
  resetPasswordToken: string;

  @Column(DataType.DATE)
  resetPasswordExpire: number;

  @Column(DataType.STRING)
  confirmEmailToken: string;

  @Column(DataType.STRING)
  confirmPhoneToken: string;

  @Column({
    type: DataType.STRING,
    defaultValue: false,
  })
  isEmailConfirmed: boolean;

  @Column({
    type: DataType.STRING,
    defaultValue: false,
  })
  isPhoneConfirmed: boolean;

  @BeforeSave
  static async hashPassword(user: User, next: NextFunction) {
    if (!user.changed('password')) {
      next();
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  matchPassword(enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
  }

  generateConfirmationToken() {
    const emailToken = cryptoRandomString({ length: 6, type: 'numeric' });
    const phoneToken = cryptoRandomString({ length: 6, type: 'numeric' });

    this.confirmEmailToken = emailToken;
    this.confirmPhoneToken = phoneToken;

    return { emailToken, phoneToken };
  }

  generatePasswordResetToken() {
    const resetToken = cryptoRandomString({ length: 4, type: 'numeric' });

    this.resetPasswordToken = resetToken;

    //set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
  }
}
