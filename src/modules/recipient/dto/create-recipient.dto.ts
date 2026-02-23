import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { Channels } from 'src/common/types/channels';

class PreferencesDto {
  @IsArray()
  @IsIn(['push', 'email', 'sms', 'inApp', 'webhook'], { each: true })
  enabledChannels: string[];

  @IsArray()
  @IsString({ each: true })
  enabledTypes: string[];
}

export class CreateRecipientDto {
  @IsString()
  external_id: string;

  @IsString()
  source: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsOptional()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;
}
