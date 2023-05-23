import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first, pipe } from 'rxjs';
import { StudentAuthService } from 'src/app/services/student-auth.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent {
  studentName?: string;

  constructor(private router: Router, private studentAuthService: StudentAuthService, private studentService: StudentService) {
    const studentNumber = this.studentAuthService.getStudentNumber();

    if (!studentNumber) {
      return;
    }

    this.studentService
      .getStudent(studentNumber)
      .pipe(first())
      .subscribe((student) => {
        this.studentName = student.name;
      });
  }

  goToDepartmentRequirementPage(departmentId: string) {
    this.router.navigate(['student', 'deparment', departmentId]);
  }

  goToProfile() {
    this.router.navigate(['student', 'profile']);
  }
}
