import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.http.post<{ fileName: string }>(environment.apiUrl + '/student_requirements_upload', formData);
  }

  loadFIle(filename: string) {
    return this.http.get(environment.apiUrl + '/student_requirements_load/' + filename, { responseType: 'arraybuffer' });
  }
}
