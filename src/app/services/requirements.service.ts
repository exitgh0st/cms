import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Requirement } from '../models/requirement';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  constructor(private http: HttpClient) {}

  getRequirementsByDepartment(departmentId: string) {
    return this.http.get<Requirement[]>(`${environment.apiUrl}/requirements/department/${departmentId}`);
  }
}
