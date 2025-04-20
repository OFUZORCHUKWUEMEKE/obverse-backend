import { Scene, SceneEnter, On, Ctx, SceneLeave } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Injectable } from "@nestjs/common"

interface PaymentSceneContext extends Context {
    scene: {
        enter: (sceneId: string) => Promise<void>;
        leave: () => Promise<void>;
    };
    session: {
        paymentData?: {
            amount?: number;
            description?: string;
            currency?: string;
            step?: string;
        };
    };
}

@Injectable()
@Scene('payment')
export class PaymentScene{
    constructor(){}

    @SceneEnter()
    async onSceneEnter(@Ctx() ctx:PaymentSceneContext){
        ctx.session.paymentData = {step :"amount"};
        // await ctx.rep
    }
}