import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getAccount(id: number) {
    return this.http.get<Account>(`${environment.apiUrl}/accounts/${id}`);
  }

  updateAccount(id: number, account: Account) {
    console.log('UPDATE');
    return this.http.patch(`${environment.apiUrl}/accounts/${id}`, account);
  }
}
