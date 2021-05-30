import { Entity } from 'src/providers/mongodb/entity.model';

export class StudentMatch extends Entity {
  email: string;
  firstName: string;
  lastName: string;
  skills: string[];
  matchSkillsCount: number;
  constructor(partial: Partial<StudentMatch>) {
    super(partial._id);
    Object.assign(this, partial);
  }
}
