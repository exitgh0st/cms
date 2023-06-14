import { HttpClient, HttpParams } from '@angular/common/http';
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

  private token?: string;
  private expiresIn?: number;
  private accountId?: number;

  private _isAuthenticated = false;

  constructor(private http: HttpClient) {}

  isAuthenticated() {
    return this._isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAccountId() {
    return this.accountId;
  }

  login(email: string, password: string | null, role_id?: string) {
    const authenticationData = { email: email, password: password };

    let params = new HttpParams();
    if (role_id) {
      params = params.set('role_id', role_id);
    }

    return this.http
      .post<{
        token: string;
        expires_in: number;
        account_id: number;
      }>(`${environment.apiUrl}/login`, authenticationData, { params: params })
      .pipe(
        map((response) => {
          this.token = response.token;
          this.expiresIn = response.expires_in;
          this.accountId = response.account_id;

          const currentDate = new Date();
          const expirationDate = new Date(currentDate.getTime() + this.expiresIn * 1000);

          this.saveAuthenticationData(this.token, expirationDate, this.accountId);
          this._isAuthenticated = true;
        })
      );
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
    return new Promise<void>(async (resolve, reject) => {
      const token = localStorage.getItem(AuthService.TOKEN_KEY);
      const expiresIn = localStorage.getItem(AuthService.TOKEN_EXPIRATION_DATE_KEY);
      const accountId = localStorage.getItem(AuthService.ACCOUNT_ID_KEY);

      if (!token || !expiresIn || !accountId) {
        this.clearAuthenticationData();
        resolve();
        return;
      }

      return this.isTokenValid(token)
        .pipe(first())
        .subscribe({
          next: (response) => {
            if (response.isValid) {
              this.token = token;
              this.expiresIn = new Date(expiresIn).getTime();
              this.accountId = parseInt(accountId);
              this._isAuthenticated = true;
            }

            resolve();
          },
          error: (error) => {
            resolve();
          }
        });
    });
  }

  logout() {
    this.token = undefined;
    this._isAuthenticated = false;
    this.accountId = undefined;
    this.expiresIn = undefined;
    this.clearAuthenticationData();
  }
}
