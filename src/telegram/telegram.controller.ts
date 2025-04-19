import { Controller } from '@nestjs/common';

@Controller('telegram')
export class TelegramController {
    constructor(private readonly telegramService:TelegramService){}

    @Post('payment-webhook')
    async handlePaymentWebhook(@Body() payload: any) {
      // This would typically involve validating the webhook signature
      // and processing the payment notification
      console.log('Payment webhook received:', payload);
      
      // Example webhook handling - would be customized based on payment provider
    //   if (payload.event === 'payment_success') {
    //     await this.telegramService.sendPaymentConfirmation(
    //       payload.userId,
    //       payload.amount,
    //       payload.transactionId
    //     );
    //   }
      
      return { success: true };
    }
}
