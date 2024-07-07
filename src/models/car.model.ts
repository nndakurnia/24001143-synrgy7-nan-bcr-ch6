import { Model, RelationMappings, ModelObject, QueryContext } from 'objection';
import { UserModel } from './user.model';

export class CarModel extends Model {
  id!: number;
  plate!: string;
  name!: string;
  image!: string;
  rent_cost!: number;
  capacity!: number;
  description!: string;
  transmission!: string;
  type!: string;
  year!: number;
  available_at!: Date;
  is_available!: boolean;
  created_at!: Date;
  created_by!: number;
  updated_at!: Date;
  updated_by!: number;
  deleted_at!: Date | null;
  deleted_by!: number | null;

  static tableName = 'cars';

  static relationMappings: RelationMappings = {
    createdBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'cars.created_by',
        to: 'users.id',
      },
    },
    updatedBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'cars.updated_by',
        to: 'users.id',
      },
    },
    deletedBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'cars.deleted_by',
        to: 'users.id',
      },
    },
  };

  async $beforeDelete(queryContext: QueryContext): Promise<void> {
    await super.$beforeDelete(queryContext);

    throw new Error('Soft delete implemented, stopping physical deletion');
  }

  // Mengecek apakah data telah dihapus
  get isDeleted(): boolean {
    return !!this.deleted_at; // Kembalikan true jika ada deleted_at
  }

  // Mengecek apakah data aktif
  get isActive(): boolean {
    return !this.deleted_at; // Kembalikan true jika tidak ada deleted_at
  }

  // Memastikan data yang diambil hanya data yang aktif
  static query() {
    return super.query<CarModel>().whereNull('deleted_at');
  }
}

export type Car = ModelObject<CarModel>;
