import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account';
import { PaymentMethod } from '../models/paymentmethod';
import { Transaction } from '../models/transactions';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private user: User = new User();
  private accounts: Account[] = [];
  private activeAccounts: Account[] = [];
  private paymentsMethod: PaymentMethod[] = [];
  private symbols: any = {};
  private transactions: any = {};
  userChange: EventEmitter<User> = new EventEmitter<User>();
  accountsChange: EventEmitter<Account[]> = new EventEmitter<Account[]>();
  loadAccountsFinish: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private http: HttpClient) {
    this.loadAccountsFinish.subscribe((finish: boolean) => {
      this.extractActives();
    });
  }

  setUser(userData: any) {
    this.user.id = userData.id;
    this.user.name = userData.name;
    this.user.avatar = userData.avatar_url;
    this.userChange.emit(this.user);
  }

  getUser(): User {
    return this.user;
  }

  /**
   * Retorn the 100 first accounts
   */
  getAccounts() {
    console.log('get accounts ');
    const accessToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'CB-VERSION': '2021-11-23',
    });
    this.http
      .get(environment.coinbase.api + '/v2/accounts?limit=100', {
        headers: headers,
      })
      .subscribe((res: any) => {
        console.log('Response: ', res);
        this.accountsChange.emit(this.convertObjectToArray(res.data));
        this.accounts = this.convertObjectToArray(res.data);
        if (res.pagination.next_uri) {
          this.getNextAccountsPage(headers, res.pagination.next_uri);
        } else {
          this.loadAccountsFinish.emit(true);
        }
      });
  }

  /**
   *
   */
  getNextAccountsPage(headers: HttpHeaders, nextUri: string) {
    this.http
      .get(environment.coinbase.api + nextUri, {
        headers: headers,
      })
      .subscribe((res: any) => {
        console.log('Response: ', res);
        this.accountsChange.emit(this.convertObjectToArray(res.data));
        this.accounts = this.accounts.concat(
          this.convertObjectToArray(res.data)
        );
        if (res.pagination.next_uri) {
          this.getNextAccountsPage(headers, res.pagination.next_uri);
        } else {
          this.loadAccountsFinish.emit(true);
        }
      });
  }

  convertObjectToArray(dataArray: any[]): Account[] {
    let accounts: Account[] = [];
    dataArray.forEach((ac: any) => {
      accounts.push(new Account(ac));
    });
    return accounts;
  }

  extractActives() {
    this.accounts.forEach((account: Account, index: number) => {
      this.symbols[account.balance.currency ? account.balance.currency: ""] = account.currency;
      if (parseFloat(account.balance.amount) > 0) {
        this.activeAccounts.push(account);
        this.getTransactions(account.id, account.currency);
        // this.accounts.splice(index, 1);
      }
    });
    console.log('[accounts] - All: ', this.accounts);
    console.log('[accounts] - Active: ', this.activeAccounts);
    console.log('[accounts] - Symbols: ', this.symbols);
  }

  /**
   *
   */
  getPaymentMethods() {
    console.log('get payment methods ');
    const accessToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'CB-VERSION': '2021-11-23',
    });
    this.http
      .get(environment.coinbase.api + '/v2/payment-methods', {
        headers: headers,
      })
      .subscribe((res: any) => {
        console.log('Response: ', res);
        this.paymentsMethod = this.convertObjectToArray2(res.data);
      });
  }

  convertObjectToArray2(dataArray: any[]): PaymentMethod[] {
    let payments: PaymentMethod[] = [];
    dataArray.forEach((method: any) => {
      payments.push(new PaymentMethod(method));
    });
    return payments;
  }

  getAccountsarray(): Account[] {
    return this.accounts;
  }

  getActiveAccounts(): Account[] {
    return this.activeAccounts;
  }

  getPaymentMethodsArray(): PaymentMethod[] {
    return this.paymentsMethod;
  }

  getCriptoBySymbol(symbol: string): string {
    return this.symbols[symbol];
  }

  getSymbols():any {
    return this.symbols;
  }

  getTransactions(accountId: string, accountName: string) {
    console.log('get transactions ');
    const accessToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'CB-VERSION': '2021-11-23',
    });
    this.http
      .get(environment.coinbase.api + `/v2/accounts/${accountId}/transactions`, {
        headers: headers,
      })
      .subscribe((res: any) => {
        console.log('Response: ', res);
        this.transactions[accountId] = this.convertObjectToArray3(res.data);
      });
  }

  convertObjectToArray3(dataArray: any[]): Transaction[] {
    let transactions: Transaction[] = [];
    dataArray.forEach((transaction: any) => {
      transactions.push(new Transaction(transaction));
    });
    return transactions;
  }

  getAllTransactionsArray(): any {
    return this.transactions;
  }
}
