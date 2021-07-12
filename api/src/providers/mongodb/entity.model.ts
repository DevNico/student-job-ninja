import { ApiProperty } from '@nestjs/swagger';

export class Entity {
  @ApiProperty({
    description: 'id',
    type: String,
  })
  _id: string;
  constructor(_id: string) {
    this._id = _id;
  }
}
