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
  template_id: string;

  @IsString()
  type: string;

  @IsEnum(['low', 'medium', 'high'])
  priority: string;

  @IsEnum(['sent', 'delivered', 'read', 'unread', 'failed'])
  status?: string;

  @IsObject()
  metadata: {
    sourceType: string;
    source_id: string;
    urlAction?: string;
    extra?: object;
  };

  @IsOptional()
  @IsDateString()
  scheduled_at?: string;
}
