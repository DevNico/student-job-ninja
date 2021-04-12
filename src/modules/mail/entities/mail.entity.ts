export class MailEntity {
  companyId: string;
  jobId: string;
  studentId: string;
  sendDate: Date;

  constructor(partial: Partial<MailEntity>) {
    Object.assign(this, partial);
    this.sendDate = new Date();
  }
}
