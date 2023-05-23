import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient) {}

  getStudent(studentNumber: string) {
    return this.http.get(`${environment.apiUrl}'/student/${studentNumber}`);
  }
}
