import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  property_1: string;

  @ApiProperty()
  property_2: string;

  @ApiProperty()
  property_3: string;
}
