import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly TOKEN_KEY = 'token';
  private static readonly TOKEN_EXPIRATION_DATE_KEY = 'token_expiration_date';
  private static readonly ACCOUNT_ID_KEY = 'account_id_key';

  private _token?: string;
  private _expiresIn?: number;
  private _accountId?: string;

  private _isAuthenticated = false;

  constructor(private http: HttpClient) {}

  isAuthenticated() {
    return this._isAuthenticated;
  }

  getToken() {
    return this._token;
  }

  login(email: string, password: string | null) {
    const authenticationData = { email: email, password: password };

    return this.http
      .post<{
        token: string;
        expires_in: number;
        account_id: string;
      }>(environment.apiUrl + '/login', authenticationData)
      .pipe(
        map((response) => {
          this._token = response.token;
          this._expiresIn = response.expires_in;
          this._accountId = response.account_id;

          const currentDate = new Date();
          const expirationDate = new Date(currentDate.getTime() + this._expiresIn * 1000);

          // this.saveAuthenticationData(this._token, expirationDate, this._studentNumber);
          this._isAuthenticated = true;
        })
      );
  }

  getAccountId() {
    return this._accountId;
  }

  private saveAuthenticationData(token: string, tokenExpirationDate: Date, account_id: string) {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
    localStorage.setItem(AuthService.TOKEN_EXPIRATION_DATE_KEY, tokenExpirationDate.toISOString());
    localStorage.setItem(AuthService.ACCOUNT_ID_KEY, account_id);
  }
}
