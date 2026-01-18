import { GenderType, UserType, UserVO } from '@org/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserProfileResponse implements UserVO {
  birthday?: string;
  @ApiProperty()
  id: string;
  @ApiProperty()
  phone: string;
  @ApiPropertyOptional()
  email?: string;
  @ApiProperty()
  memberId: string;
  @ApiProperty()
  firstName: string;
  @ApiPropertyOptional()
  midName?: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  gender: GenderType;
  @ApiProperty({
    enum: UserType,
  })
  type: UserType;

  @ApiPropertyOptional()
  avatarS3uri?: string;
  @ApiPropertyOptional()
  coverImageS3uri?: string;
  @ApiPropertyOptional()
  avatarImageUrl?: string;
  @ApiPropertyOptional()
  coverImageUrl?: string;

  @ApiProperty()
  addressState: string;
  @ApiProperty()
  addressCity: string;
  @ApiPropertyOptional()
  addressDetail?: string;
  @ApiPropertyOptional()
  whatsapp?: string;
  @ApiPropertyOptional()
  facebook?: string;

  @ApiPropertyOptional()
  source?: number;
  @ApiPropertyOptional()
  crmId?: string;
}
