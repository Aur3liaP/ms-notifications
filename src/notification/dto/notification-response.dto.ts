export class NotificationResponseDto {
  id: string;
  type: string;
  priority: string;
  status: string;
  channel: string[];
  metadata: object;
}