import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first, pipe } from 'rxjs';
import { Department } from 'src/app/models/department';
import { Student } from 'src/app/models/student';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent {
  student?: Student;
  departments?: Department[];

  constructor(
    private router: Router,
    private authService: AuthService,
    private studentService: StudentService,
    private departmentService: DepartmentService
  ) {
    const accountId = this.authService.getAccountId();
    if (!accountId) {
      this.router.navigate(['login']);
      return;
    }
    this.studentService
      .getStudentByAccountId(accountId)
      .pipe(first())
      .subscribe((student) => {
        this.student = student;
      });

    this.departmentService
      .getDepartments()
      .pipe(first())
      .subscribe((departments) => {
        this.departments = departments;
      });
  }

  goToDepartmentRequirementPage(departmentId: number | undefined) {
    if (!departmentId) {
      return;
    }

    this.router.navigate(['student', 'requirements', departmentId]);
  }

  goToProfile() {
    this.router.navigate(['student', 'profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  getLogoURL(department: Department) {
    switch (department.name) {
      case 'Information and Communication Technology Office':
        return '/assets/img/udm-logo-transparent.png';
      case 'Security':
        return '/assets/img/udm-logo-transparent.png';
      case 'Library':
        return '/assets/img/udm-library.png';
      case 'Office of the Students Affair':
        return '/assets/img/udm-osa.png';
      case 'Guidance Counselling and Psychological Services':
        return '/assets/img/udm-gcpso.png';
      case 'Clinic':
        return '/assets/img/udm-clinic.png';
      default:
        return '/assets/img/udm-logo-transparent.png';
    }
  }
}
