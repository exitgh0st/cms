import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private http: HttpClient) {}

  getRole(roleId: number) {
    return this.http.get<Role>(environment.apiUrl + '/roles/' + roleId);
  }
}
