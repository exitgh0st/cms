import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getAdminByAccountId(accountId: string) {
    return this.http.get<Admin>(`${environment.apiUrl}/admins/account/${accountId}`);
  }
}
