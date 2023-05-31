import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentRequirement } from '../models/student-requirement';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentRequirementService {
  constructor(private http: HttpClient) {}

  createStudentRequirement(studentRequirement: StudentRequirement) {
    return this.http.post<StudentRequirement>(environment.apiUrl + '/student_requirements', studentRequirement);
  }

  updateStudentRequirement(id: number, studentRequirement: StudentRequirement) {
    return this.http.patch(environment.apiUrl + '/student_requirements/' + id, studentRequirement);
  }

  getStudentRequirementOfRequirement(requirementId: number) {
    return this.http.get<StudentRequirement>(`${environment.apiUrl}/student_requirements/requirement/${requirementId}`);
  }

  getStudentRequirementByStudentIdsAndRequirementIds(studentIds: string[], requirementIds: string[]) {
    return this.http.get<StudentRequirement[]>(`${environment.apiUrl}/student_requirements_by_student_ids_and_requirement_ids`, {
      params: { student_ids: studentIds, requirement_ids: requirementIds }
    });
  }
}
