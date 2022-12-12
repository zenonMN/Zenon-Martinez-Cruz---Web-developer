export class Transaction{
    id: string;
    type: string;
    status: string;
    amount: string;
    description: string;
    nativeAmount: string;
    createdAt: string;
    updatedAt: string;
    to: any;
    details: any;

    constructor(data: any) {
        this.id = data.id;
        this.amount = data.amount.amount + " " + data.amount.currency;
        this.nativeAmount = data.native_amount.amount + " " + data.native_amount.currency;
        this.type = data.type; 
        this.status = data.status;
        this.description = data.description;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
        if(data.to)
        this.to = data.to.id;
        this.details = data.details;
    }
 }