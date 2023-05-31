import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, first } from 'rxjs';
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
  private _accountId?: number;

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
        account_id: number;
      }>(environment.apiUrl + '/login', authenticationData)
      .pipe(
        map((response) => {
          this._token = response.token;
          this._expiresIn = response.expires_in;
          this._accountId = response.account_id;

          const currentDate = new Date();
          const expirationDate = new Date(currentDate.getTime() + this._expiresIn * 1000);

          this.saveAuthenticationData(this._token, expirationDate, this._accountId);
          this._isAuthenticated = true;
        })
      );
  }

  getAccountId() {
    return this._accountId;
  }

  private saveAuthenticationData(token: string, tokenExpirationDate: Date, account_id: number) {
    localStorage.setItem(AuthService.TOKEN_KEY, token);
    localStorage.setItem(AuthService.TOKEN_EXPIRATION_DATE_KEY, tokenExpirationDate.toISOString());
    localStorage.setItem(AuthService.ACCOUNT_ID_KEY, account_id.toString());
  }

  private clearAuthenticationData() {
    localStorage.removeItem(AuthService.TOKEN_KEY);
    localStorage.removeItem(AuthService.TOKEN_EXPIRATION_DATE_KEY);
    localStorage.removeItem(AuthService.ACCOUNT_ID_KEY);
  }

  private isTokenValid(token: string) {
    const tokenData = { token: token };

    return this.http.post<{ isValid: boolean }>(environment.apiUrl + '/validate', tokenData);
  }

  autoLogin() {
    return new Promise(async (resolve, reject) => {
      const token = localStorage.getItem(AuthService.TOKEN_KEY);
      const expiresIn = localStorage.getItem(AuthService.TOKEN_EXPIRATION_DATE_KEY);
      const accountId = localStorage.getItem(AuthService.ACCOUNT_ID_KEY);

      if (!token || !expiresIn || !accountId) {
        this.clearAuthenticationData();
        resolve(true);
        return;
      }

      await this.isTokenValid(token)
        .pipe(first())
        .subscribe({
          next: (response) => {
            if (response.isValid === undefined || response.isValid === null) {
              resolve(true);

              return;
            }

            if (!response.isValid) {
              resolve(true);

              return;
            }
          },
          error: (error) => {
            resolve(true);

            return;
          }
        });

      this._token = token;
      this._expiresIn = new Date(expiresIn).getTime();
      this._accountId = parseInt(accountId);
      this._isAuthenticated = true;
      resolve(true);
    });
  }

  logout() {
    this._token = undefined;
    this._isAuthenticated = false;
    this._accountId = undefined;
    this._expiresIn = undefined;
    this.clearAuthenticationData();
  }
}
