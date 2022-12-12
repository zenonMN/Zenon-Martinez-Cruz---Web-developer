export class Price{
    id: string;
    amount: string;
    currency: string;

    constructor(name: string, data: any) {
        this.id = name;
        this.currency = "USD";
        this.amount = data.amount;
    }
 }