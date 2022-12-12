import { Component, OnInit, NgZone } from '@angular/core';
import { User } from 'src/app/models/user';
import { ProfileService } from 'src/app/services/profile.service';
import { ProvidersService } from 'src/app/services/providers.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: User = new User();
  constructor(private profileService: ProfileService, private zone: NgZone, private providerService: ProvidersService) {
    profileService.userChange.subscribe((user: User) => {
      zone.run(() => {
        this.user = user;
      });
      console.log("new USER: ", user);
    });
   }

  ngOnInit(): void {
    // this.user = this.profileService.getUser();
    console.log("USER init: ", this.user);
  }

  signInOut(){
    this.providerService.signOutGoogleDrive();
  }
}
