import { Component, Input, OnInit } from '@angular/core';
import { Account } from 'src/app/models/account';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  @Input() public accounts: Account[] = [];
  @Input() public transactions: any = {};
  constructor() { }

  ngOnInit(): void {
  }

  getCryptoIcon(currency: string): string {
    let className: string =  "crypto-icon ";
    className += "icon-"+currency.toLowerCase();
    return className;
  }

  getTransactions(accountId: string) {

  }

}
