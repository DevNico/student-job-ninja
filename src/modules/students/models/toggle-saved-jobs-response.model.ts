import { ApiProperty } from '@nestjs/swagger';

export class ToggleSavedJobsResponse {
  @ApiProperty({ enum: ['deleted', 'added'] })
  action: savedJobsActions;

  @ApiProperty()
  ok: boolean;
}

export enum savedJobsActions {
  deleted = 'deleted',
  added = 'added',
}
