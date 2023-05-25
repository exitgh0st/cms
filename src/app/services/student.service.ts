import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient) {}

  getStudent(studentNumber: string) {
    return this.http.get<Student>(`${environment.apiUrl}/students/${studentNumber}`);
  }
}
