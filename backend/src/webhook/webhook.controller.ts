import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookPayloadDto } from './dto/webhook.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: WebhookPayloadDto) {
    return this.webhookService.handleWebhook(payload);
  }
}