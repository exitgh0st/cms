import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthService {
  private static readonly TOKEN_KEY = 'token';
  private static readonly TOKEN_EXPIRATION_DATE_KEY = 'token_expiration_date';
  private static readonly STUDENT_NUMBER_KEY = 'student_number';

  private _token?: string;
  private _expiresIn?: number;
  private _studentNumber?: string;

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
        student_number: string;
      }>(environment.apiUrl + '/student/login', authenticationData)
      .pipe(
        map((response) => {
          this._token = response.token;
          this._expiresIn = response.expires_in;
          this._studentNumber = response.student_number;

          const currentDate = new Date();
          const expirationDate = new Date(currentDate.getTime() + this._expiresIn * 1000);

          // this.saveAuthenticationData(this._token, expirationDate, this._studentNumber);
          this._isAuthenticated = true;
        })
      );
  }

  getStudentNumber() {
    return this._studentNumber;
  }

  private saveAuthenticationData(token: string, tokenExpirationDate: Date, studentNumber: string) {
    console.log(tokenExpirationDate);
    localStorage.setItem(StudentAuthService.TOKEN_KEY, token);
    localStorage.setItem(StudentAuthService.TOKEN_EXPIRATION_DATE_KEY, tokenExpirationDate.toISOString());
    localStorage.setItem(StudentAuthService.STUDENT_NUMBER_KEY, studentNumber);
  }
}
