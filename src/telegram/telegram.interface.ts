export interface TelegramUser{
    id:number;
    username?:string;
    first_name?:string;
    last_name?:string
}

export interface TelegramContext{
    from:TelegramUser,
    chat:{
        id:number
    };
    message?:any;
    callbackQuery?:any;
}