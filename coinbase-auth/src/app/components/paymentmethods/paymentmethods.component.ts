import { Component, Input, OnInit } from '@angular/core';
import { PaymentMethod } from 'src/app/models/paymentmethod';

@Component({
  selector: 'app-paymentmethods',
  templateUrl: './paymentmethods.component.html',
  styleUrls: ['./paymentmethods.component.css']
})
export class PaymentmethodsComponent implements OnInit {
  @Input() methods:PaymentMethod[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
