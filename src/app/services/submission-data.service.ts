import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { SubmissionData } from '../models/submission_data';

@Injectable({
  providedIn: 'root'
})
export class SubmissionDataService {
  constructor(private http: HttpClient) {}

  getSubmissionData() {
    return this.http.get(environment.apiUrl + '/submission_data/1');
  }

  updateSubmissionData(submissionData: SubmissionData) {
    return this.http.patch(environment.apiUrl + '/submission_data/1', submissionData);
  }
}
