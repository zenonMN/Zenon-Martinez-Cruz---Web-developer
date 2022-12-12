import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor() {}

  isLoggedIn(): boolean {
    const expiration = this.getExpiration();
    if (expiration) return moment().isBefore(expiration);
    else return false;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  logOut() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }
    return null;
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      setTimeout(() => {
        this.router.navigate(['home']);
      }, 0);
    }
    return true;
  }
}

@Injectable()
export class AuthGuardInit implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      setTimeout(() => {
        this.router.navigate(['dashboard']);
      }, 0);
    }
    return true;
  }
}
