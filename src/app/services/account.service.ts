import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getAccount(accountId: number) {
    return this.http.get<Account>(environment.apiUrl + '/accounts/' + accountId);
  }
}
