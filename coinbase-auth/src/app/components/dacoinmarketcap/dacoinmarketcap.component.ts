import { Component, OnInit } from '@angular/core';
import { ScriptService } from 'src/app/services/script.service';

@Component({
  selector: 'app-dacoinmarketcap',
  templateUrl: './dacoinmarketcap.component.html',
  styleUrls: ['./dacoinmarketcap.component.css']
})
export class DacoinmarketcapComponent implements OnInit {

  constructor(
    private scriptService: ScriptService
  ) { }

  ngOnInit(): void {

  }

}
