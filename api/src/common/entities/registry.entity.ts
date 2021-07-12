import { Entity } from 'src/providers/mongodb/entity.model';
import { Role } from '../enums/roles.enum';

export class Registry extends Entity {
  _id: string;
  email: string;
  roles: Role[];

  constructor(id, partial: Partial<Registry>) {
    super(id);
    Object.assign(this, partial);
  }
}
