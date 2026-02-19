import { IsString, IsEnum, IsOptional, IsObject, IsDateString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  recipient_id: string;

  @IsString()
  type: string;

  @IsEnum(['low', 'medium', 'high'])
  priority: string;

  @IsEnum(['push', 'email', 'sms', 'inApp', 'webhook'])
  channel: string;

  @IsString()
  template_id: string;

  @IsOptional()
  @IsString()
  urlAction?: string;

  @IsObject()
  metadata: {
    sourceType: string;
    source_id: string;
    extra?: object;
  };

  @IsOptional()
  @IsDateString()
  scheduled_at?: string;
}