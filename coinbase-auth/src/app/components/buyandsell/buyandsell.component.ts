import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-buyandsell',
  templateUrl: './buyandsell.component.html',
  styleUrls: ['./buyandsell.component.css']
})
export class BuyandsellComponent implements OnInit {
  private symbols: any = {};
  constructor(
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
  }

  getCryptoIcon(currency: string): string {
    let className: string =  "crypto-icon ";
    className += "icon-"+currency.toLowerCase();
    return className;
  }

  getCriptos(): any[] {
    this.symbols = this.profileService.getSymbols();
    if(this.symbols)
      return Object.keys(this.symbols);
    return [];
  }

  getCriptoName(cripto: string) {
    return this.symbols[cripto];
  }
}
