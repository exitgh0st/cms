import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Requirement } from '../models/requirement';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  constructor(private http: HttpClient) {}

  createRequirement(requirement: Requirement) {
    return this.http.post<Requirement>(environment.apiUrl + '/requirements', requirement);
  }

  getRequirements() {
    return this.http.get<Requirement[]>(`${environment.apiUrl}/requirements`);
  }

  getRequirementsByDepartment(departmentId: number) {
    return this.http.get<Requirement[]>(`${environment.apiUrl}/requirements/department/${departmentId}`);
  }

  updateRequirement(id: number, requirement: Requirement) {
    return this.http.patch(environment.apiUrl + '/requirements/' + id, requirement);
  }

  deleteRequirement(id: number) {
    return this.http.delete(environment.apiUrl + '/requirements/' + id);
  }
}
