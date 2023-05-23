import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentAuthService } from 'src/app/services/student-auth.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent {
  // studentName: string;

  constructor(private router: Router, private studentAuthService: StudentAuthService, private studentService: StudentService) {
    const studentNumber = this.studentAuthService.getStudentNumber();
  }

  goToDepartmentRequirementPage(departmentId: string) {
    this.router.navigate(['student', 'deparment', departmentId]);
  }

  goToProfile() {
    this.router.navigate(['student', 'profile']);
  }
}
