import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'leads' })
export class Lead extends Model<Lead> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare companyName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare contactPerson: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare corporateEmail: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare internationalPhone: string;

  @Column({ type: DataType.JSON, allowNull: false })
  declare targetedVerticals: string[];

  @Column({ type: DataType.JSON, allowNull: false })
  declare leadDeliveryClass: string[];

  @Column({ type: DataType.STRING, allowNull: false })
  declare weeklyVolumeAllocation: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare preferredDeliveryMechanism: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare operationalNotes: string | null;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'new' })
  declare status: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
