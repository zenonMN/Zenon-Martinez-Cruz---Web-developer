export class PaymentMethod{
    id: string;
    type : string;
    name: string;
    currency: string;
    primaryBuy: boolean;
    primarySell: boolean;
    allowBuy: boolean;
    allowSell: boolean;
    allowDeposit: boolean;
    allowWithdraw: boolean;
    instantBuy: boolean;
    instantSell: boolean;
    limits: any;
    
    constructor(data: any) {
        this.name=data.name;
        this.primaryBuy=data.primary_buy;
        this.primarySell=data.primary_sell;
        this.id = data.id;
        this.allowSell = data.allow_sell;
        this.allowBuy = data.allow_buy;
        this.allowDeposit = data.allow_deposit;
        this.allowWithdraw = data.allow_withdraw;
        this.type = data.type;
        this.currency = data.currency;
        this.instantBuy = data.instant_buy;
        this.instantSell = data.instant_sell;
        if(data.limits)
        this.limits = {
            buy: {
                label: data.limits.buy[0].label,
                periodInDays: data.limits.buy[0].period_in_days,
                remaining: data.limits.buy[0].remaining.amount,
                total: data.limits.buy[0].total.amount
            },
            deposit: {
                label: data.limits.deposit[0].label,
                description: data.limits.deposit[0].description,
                periodInDays: data.limits.deposit[0].period_in_days,
                remaining: data.limits.deposit[0].remaining.amount,
                total: data.limits.deposit[0].total.amount
            }
        };
    }
 }