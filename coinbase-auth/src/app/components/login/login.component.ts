import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ProfileService } from 'src/app/services/profile.service';
import { ProviderService } from 'src/app/services/providers.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private providerService: ProviderService, 
    private profileService: ProfileService,
    private router: Router
  ) {
    profileService.userChange.subscribe((user: User) => {
      this.router.navigate(['dashboard']);
    });
   }

  ngOnInit(): void {
  }

  logInWithCoinbase() {
    this.providerService.logInCoinbase();
  }

  @HostListener('window:message', ['$event'])
  onPostMessage(event: any) {
    // console.log("EVENT: ", event);
    if(event.data["provider"] === "coinbase") {
        // Use an EventEmitter to noboxtify the other components that user logged in
       console.log("Coinbase code: ", event.data );
       this.providerService.getCoinbaseAccessToken(event.data["code"]);
    }
  }

}
