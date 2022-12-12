export class BuySellDepositWithdrawal{
    id: string;
    status: string;
    amount: string;
    total: string;
    subtotal: string;
    fee: string;
    paymentMethodId: string;
    transactionId: string;
    createdAt: string;
    updatedAt: string;
    committed: boolean;
    instant: boolean | null;

    constructor(data: any) {
        this.id = data.id;
        this.paymentMethodId = data.payment_method.id;
        this.transactionId = data.transaction.id;
        this.amount = data.amount.amount + " " + data.amount.currency;
        this.total = data.total.amount + " " + data.total.currency;
        this.status = data.status;
        this.subtotal = data.subtotal.amount + " " + data.subtotal.currency;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
        this.fee = data.fee.amount + " " + data.fee.amount;
        this.committed = data.committed;
        this.instant = data.instant; 
    }
 }