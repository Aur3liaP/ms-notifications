export class NotificationResponseDto {
  id: string;
  title: string;
  description: string;
  type: string;
  channel: string;
  status: string;
  priority: string;
  metadata?: object;
  created_at: Date;
  updated_at: Date;
}