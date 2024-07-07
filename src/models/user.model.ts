import { Model, RelationMappings, ModelObject } from 'objection';
import { CarModel } from './car.model';

export class UserModel extends Model {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  user_role!: 'superadmin' | 'admin' | 'member';
  created_at!: Date;

  static tableName = 'users';

  static relationMappings: RelationMappings = {
    createdBy: {
      relation: Model.HasManyRelation,
      modelClass: CarModel,
      join: {
        from: 'users.id',
        to: 'cars.created_by',
      },
    },
    updatedBy: {
      relation: Model.HasManyRelation,
      modelClass: CarModel,
      join: {
        from: 'users.id',
        to: 'cars.updated_by',
      },
    },
    deletedBy: {
      relation: Model.HasManyRelation,
      modelClass: CarModel,
      join: {
        from: 'users.id',
        to: 'cars.deleted_by',
      },
    },
  };
}

export type User = ModelObject<UserModel>;
