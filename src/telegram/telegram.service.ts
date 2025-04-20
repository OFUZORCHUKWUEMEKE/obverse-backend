import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { TelegramContext } from './telegram.interface'
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class TelegramService {
    constructor(
        @InjectBot() private bot: Telegraf<Context>,
        private configService: ConfigService,
        private userRepository: UserRepository
    ) { }

    async onModuleInit() {
        await this.setupCommands();

        // Set up bot middleware
        this.bot.use(async (ctx, next) => {
            try {
                // Process user if they don't exist
                const telegramUser = ctx.from;
                console.log(telegramUser)
                if (telegramUser) {
                    const user = this.userRepository.findOne({ user_id: telegramUser.id.toString() })
                    if (!user) {
                        await this.userRepository.create({
                            user_id: telegramUser.id.toString(),
                            username: telegramUser.username,
                            first_name: telegramUser.first_name,
                            last_name: telegramUser.last_name,
                        })
                    }
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
        this.bot.command('profile', this.handleProfiles.bind(this));
        // this.bot.command('payment', this.handlePayment.bind(this));
        // this.bot.command('transactions', this.handleTransactions.bind(this));

        // Payment callbacks
        // this.bot.action(/^pay_(.+)$/, this.handlePaymentCallback.bind(this));
    }


    async handleStart(ctx: Context) {
        const user = ctx.from;
        await ctx.reply(`Welcome to Obverse, ${user.first_name || 'there'}! 👋\n\nUse /help to see available commands.`);
        const existing = await this.userRepository.findOne({ user_id: user.id.toString() })
        if (!existing) {
            const new_user = await this.userRepository.create({
                user_id: user.id.toString(),
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username
            })
            console.log(new_user)
        }
        console.log(existing)
    }

    async handleHelp(ctx: Context) {
        await ctx.reply(
            'Available commands:\n\n' +
            '/start - Start the bot\n' +
            '/help - Show this help message\n' +
            '/profile - View your profile\n' +
            '/payment - Make a payment\n' +
            '/transactions - View your transaction history'
        );
    }

    async handleProfiles(ctx: Context): Promise<void> {
        const telegramId = ctx.from.id.toString();
        // const user = await this.userService.findByTelegramId(telegramId);
        const user = await this.userRepository.findOne({ user_id: telegramId })

        if (!user) {
            ctx.reply('User not found. Please use /start to register.');
        }
        await ctx.reply(
            `Profile 👤\n\n` +
            `Telegram ID: ${user.user_id}\n` +
            `Username: ${user.username || 'Not set'}\n` +
            `First Name: ${user.first_name || 'Not set'}\n` +
            `Last Name: ${user.last_name || 'Not set'}\n`
        )
    }
}
