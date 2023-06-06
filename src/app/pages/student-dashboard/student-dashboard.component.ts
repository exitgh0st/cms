import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first, pipe } from 'rxjs';
import { Department } from 'src/app/models/department';
import { Student } from 'src/app/models/student';
import { SubmissionData } from 'src/app/models/submission_data';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { StudentService } from 'src/app/services/student.service';
import { SubmissionDataService } from 'src/app/services/submission-data.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent {
  student?: Student;
  departments?: Department[];
  submissionData?: SubmissionData;

  constructor(
    private router: Router,
    private authService: AuthService,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private submissionDataService: SubmissionDataService
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

    this.submissionDataService
      .getSubmissionData()
      .pipe(first())
      .subscribe((submissionData) => {
        this.submissionData = submissionData;
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

  daysLeft() {
    if (!this.submissionData?.date_end) {
      return;
    }

    const endDate = new Date(this.submissionData.date_end);

    const timeLeft = endDate.getTime() - new Date().getTime();

    return this.convertMsToTime(timeLeft);
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  convertMsToTime(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;

    // 👇️ If you want to roll hours over, e.g. 00 to 24
    // 👇️ uncomment the line below
    // uncommenting next line gets you `00:00:00` instead of `24:00:00`
    // or `12:15:31` instead of `36:15:31`, etc.
    // 👇️ (roll hours over)
    // hours = hours % 24;

    return `${this.padTo2Digits(days)} days, ${this.padTo2Digits(hours)} hours, ${this.padTo2Digits(minutes)} minutes, ${this.padTo2Digits(
      seconds
    )} seconds`;
  }
}
