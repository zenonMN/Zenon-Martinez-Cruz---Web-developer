export class Account{
    id: string ;
    primary: boolean;
    allowDeposits: boolean;
    allowWithdrawals: boolean;
    balance: any;
    type : string ;
    name: string ;
    currency: string ;

    constructor(data: any) {
        this.name=data.name;
        this.primary=data.primary;
        this.id = data.id;
        this.allowDeposits = data.allow_deposits;
        this.allowWithdrawals = data.allow_withdrawals;
        this.balance = data.balance;
        this.type = data.type;
        this.currency = data.currency.name;
    }
 }