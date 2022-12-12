import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProvidersService } from 'src/app/services/providers.service';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {

  constructor(private route: ActivatedRoute, private providerService: ProvidersService) { }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      console.log("params: ", params); // { order: "popular" }
      if(params.code) {
        // this.providerService.getBoxAccessToken(params.code);
        window.opener.postMessage({
          provider: "box",
          code: params.code
        },"*" );
        window.close();
      }
    });
  }

}
