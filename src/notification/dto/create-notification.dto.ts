import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsDateString,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  external_id: string;

  @IsString()
  template_name: string;

  @IsString()
  source: string;

  @IsEnum(['low', 'medium', 'high'])
  priority?: string;

  @IsEnum(['sent', 'delivered', 'read', 'unread', 'failed'])
  status?: string;

  @IsObject()
  metadata: {
    sourceType: string;
    source_id?: string;
    urlAction?: string;
    extra?: object;
  };

  @IsOptional()
  @IsDateString()
  scheduled_at?: string;
}
