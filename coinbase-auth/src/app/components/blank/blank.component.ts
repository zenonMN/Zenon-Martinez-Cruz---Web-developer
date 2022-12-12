import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      console.log("params: ", params);
      if(params["code"]) {
        window.opener.postMessage({
          provider: "coinbase",
          code: params["code"]
        },"*" );
        window.close();
      }
    });
  }

}
