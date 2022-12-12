import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  @Input() accounts:any = [];
  constructor() { }

  ngOnInit(): void {
  }

  getCryptoIcon(currency: string): string {
    let className: string =  "crypto-icon ";
    className += "icon-"+currency.toLowerCase();
    return className;
  }
}
