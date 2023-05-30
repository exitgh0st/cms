import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  getDepartment(departmentId: string) {
    return this.http.get<Department>(`${environment.apiUrl}/departments/${departmentId}`);
  }

  getDepartments() {
    return this.http.get<Department[]>(`${environment.apiUrl}/departments`);
  }
}
