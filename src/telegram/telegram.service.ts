import { Injectable } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import {TelegramContext} from './telegram.interface'

@Injectable()
export class TelegramService {
    constructor(
        @InjectBot() private bot: Telegraf<Context>,
        private configService: ConfigService,
    ) { }

    async onModuleInit() {
        await this.setupCommands();

        // Set up bot middleware
        this.bot.use(async (ctx, next) => {
            try {
                // Process user if they don't exist
                const telegramUser = ctx.from;
                if (telegramUser) {
                    // await this.userService.findOrCreateUser({
                    //   telegramId: telegramUser.id.toString(),
                    //   username: telegramUser.username,
                    //   firstName: telegramUser.first_name,
                    //   lastName: telegramUser.last_name,
                    // });
                }
                return next();
            } catch (error) {
                console.error('Bot middleware error:', error);
            }
        });
        this.registerHandlers();
    }

    private async setupCommands() {
        await this.bot.telegram.setMyCommands([
            { command: '/start', description: 'Start the bot' },
            { command: '/help', description: 'Get help' },
            { command: 'profile', description: 'View your profile' },
            { command: 'payment', description: 'Make a payment' },
            { command: 'transactions', description: 'View your transactions' },
        ])
    }

    private registerHandlers() {
        this.bot.start(this.handleStart.bind(this));
        this.bot.help(this.handleHelp.bind(this));
        this.bot.command('profile', this.handleProfile.bind(this));
        this.bot.command('payment', this.handlePayment.bind(this));
        this.bot.command('transactions', this.handleTransactions.bind(this));

        // Payment callbacks
        this.bot.action(/^pay_(.+)$/, this.handlePaymentCallback.bind(this));
    }


    async handleStart(ctx:Context) {
        const user = ctx.from;
        await ctx.reply(`Welcome to Payment Bot, ${user.first_name || 'there'}! 👋\n\nUse /help to see available commands.`);
    }

    async handleHelp(ctx: TelegramContext) {
        await ctx.reply(
          'Available commands:\n\n' +
          '/start - Start the bot\n' +
          '/help - Show this help message\n' +
          '/profile - View your profile\n' +
          '/payment - Make a payment\n' +
          '/transactions - View your transaction history'
        );
    }
    
    async handleProfile(ctx: TelegramContext) {
        const telegramId = ctx.from.id.toString();
        const user = await this.userService.findByTelegramId(telegramId);
        
        if (!user) {
          return ctx.reply('User not found. Please use /start to register.');
        }
        
        await ctx.reply(
          `Your Profile 👤\n\n` +
          `ID: ${user.id}\n` +
          `Telegram ID: ${user.telegramId}\n` +
          `Username: ${user.username || 'Not set'}\n` +
          `First Name: ${user.firstName || 'Not set'}\n` +
          `Last Name: ${user.lastName || 'Not set'}\n` +
          `Registered: ${user.createdAt.toDateString()}`
        );
      }
}
