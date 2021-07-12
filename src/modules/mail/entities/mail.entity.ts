import { Entity } from 'src/providers/mongodb/entity.model';

export class MailEntity extends Entity {
  companyId: string;
  jobId: string;
  studentId: string;
  sendDate: Date;

  constructor(partial: Partial<MailEntity>) {
    super(`${partial.jobId}-${partial.studentId}`);
    Object.assign(this, partial);
    this.sendDate = new Date();
  }
}
