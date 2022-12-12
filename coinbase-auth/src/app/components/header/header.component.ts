import { Component, NgZone, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() openWidget = new EventEmitter<boolean>();
  public user: User = new User();
  constructor(private profileService: ProfileService, private zone: NgZone, 
    private authService: AuthService) {
    profileService.userChange.subscribe((user: User) => {
      zone.run(() => {
        this.user = user;
      });
      console.log("new USER: ", user);
    });
   }

  ngOnInit(): void {
  }

  openCoinMarketWidget() {
    this.openWidget.emit(true);
  }

  logout() {
    this.authService.logOut();
    
  }

}
