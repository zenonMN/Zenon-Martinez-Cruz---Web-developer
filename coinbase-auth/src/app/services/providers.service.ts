import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

const REDIRECT_URL = 'http://localhost:4200/blank';
@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  constructor(
    private profileService: ProfileService,
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Coinbase signIn
   */
  logInCoinbase() {
    let authorizationUrl = `${environment.coinbase.url}/authorize?response_type=code&client_id=${environment.coinbase.client_id}&redirect_uri=${REDIRECT_URL}&scope=${environment.coinbase.scope}&account=all`;
    console.log('authorize_url: ', authorizationUrl);
    window.open(authorizationUrl, '_blank');
  }

  /**
   *
   */
  getCoinbaseAccessToken(code: string) {
    let params: HttpParams = new HttpParams({
      fromObject: {
        grant_type: 'authorization_code',
        code: code,
        client_id: environment.coinbase.client_id,
        client_secret: environment.coinbase.client_secret,
        redirect_uri: REDIRECT_URL,
      },
    });

    this.http
      .post(environment.coinbase.token_url, params)
      .subscribe((response: any) => {
        console.log('Response', response);
        const expiresAt = moment().add(response.expires_in, 'seconds');
        localStorage.setItem('id_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
        console.log('boxAccessToken', response.access_token);
        this.coinbaseGetUser(response.access_token);
        this.profileService.getAccounts();
        this.profileService.getPaymentMethods();
      });
  }

  /**
   *
   */
  coinbaseGetUser(accessToken: string | null) {
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      'CB-VERSION': '2021-11-23'
    });
    this.http
      .get(environment.coinbase.api + '/v2/user', { headers: headers })
      .subscribe((res: any) => {
        console.log('Response: ', res);
        if (res.data) this.profileService.setUser(res.data);
        else {
          console.error('[API] - user data not found');
        }
      });
  }

  /**
   *
   */
  requestNewToken(refreshToken: string | null) {
    if (!refreshToken) return;
    let params: HttpParams = new HttpParams({
      fromObject: {
        grant_type: 'refresh_token',
        client_id: environment.coinbase.client_id,
        client_secret: environment.coinbase.client_secret,
        redirect_uri: REDIRECT_URL,
        refresh_token: refreshToken,
      },
    });

    this.http
      .post(environment.coinbase.token_url, params)
      .subscribe((response: any) => {
        console.log('Response', response);
        const expiresAt = moment().add(response.expires_in, 'seconds');
        localStorage.setItem('id_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
        console.log('boxAccessToken', response.access_token);
        this.coinbaseGetUser(response.access_token);
      });
  }
}
