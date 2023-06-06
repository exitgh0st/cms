import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getAdmin(id: number) {
    return this.http.get<Admin>(`${environment.apiUrl}/admins/${id}`);
  }

  getAdminByAccountId(accountId: number) {
    return this.http.get<Admin>(`${environment.apiUrl}/admins/account/${accountId}`);
  }

  getAdmins() {
    return this.http.get<Admin[]>(`${environment.apiUrl}/admins`);
  }

  createAdminWithAccount(admin: Admin) {
    return this.http.post<Admin>(`${environment.apiUrl}/admins/account`, admin);
  }

  updateAdmin(id: number, admin: Admin) {
    return this.http.patch(`${environment.apiUrl}/admins/${id}`, admin);
  }

  updateAdminWithAccount(id: number, admin: Admin) {
    return this.http.patch(`${environment.apiUrl}/admins/account/${id}`, admin);
  }

  deleteAdmin(id: number) {
    return this.http.delete(`${environment.apiUrl}/admins/${id}`);
  }
}
