import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first, pipe } from 'rxjs';
import { Department } from 'src/app/models/department';
import { Requirement } from 'src/app/models/requirement';
import { Student } from 'src/app/models/student';
import { StudentRequirement } from 'src/app/models/student-requirement';
import { SubmissionData } from 'src/app/models/submission_data';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { RequirementService } from 'src/app/services/requirements.service';
import { StudentRequirementService } from 'src/app/services/student-requirement.service';
import { StudentService } from 'src/app/services/student.service';
import { SubmissionDataService } from 'src/app/services/submission-data.service';
import { RequirementPair } from '../student-department-requirement/student-department-requirement.component';

type DepartmentRequirementsData = {
  departmentId: number;
  requirementCount: number;
  studentRequirementPassedCount: number;
};

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent {
  student?: Student;
  departments?: Department[];
  submissionData?: SubmissionData;
  departmentRequirementsDataList: DepartmentRequirementsData[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private submissionDataService: SubmissionDataService,
    private requirementService: RequirementService,
    private studentRequirementService: StudentRequirementService
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

        this.departmentService
          .getDepartments()
          .pipe(first())
          .subscribe((departments) => {
            this.departments = departments;
            this.requirementService
              .getRequirements()
              .pipe(first())
              .subscribe((requirements) => {
                if (!this.student?.student_number) {
                  return;
                }

                const requirementIds = [];

                for (let requirement of requirements) {
                  if (!requirement.id) {
                    continue;
                  }

                  requirementIds.push(requirement.id.toString());
                }

                if (requirementIds.length <= 0) {
                  for (let department of departments) {
                    if (!department.id) {
                      continue;
                    }

                    this.departmentRequirementsDataList.push({
                      departmentId: department.id,
                      requirementCount: 0,
                      studentRequirementPassedCount: 0
                    });
                  }
                  return;
                }

                this.studentRequirementService
                  .getStudentRequirementByStudentIdsAndRequirementIds([this.student.student_number], requirementIds)
                  .pipe(first())
                  .subscribe((studentRequirements) => {
                    for (let department of departments) {
                      const departmentId = department.id;

                      if (!departmentId) {
                        continue;
                      }

                      let requirementCount = 0;
                      let studentRequirementCount = 0;
                      for (let requirement of requirements) {
                        if (requirement.created_by?.department?.id === departmentId) {
                          const requirementId = requirement.id;
                          requirementCount++;
                          for (let studentRequirement of studentRequirements) {
                            if (studentRequirement.requirement?.id === requirementId) {
                              studentRequirementCount++;
                            }
                          }
                        }
                      }

                      this.departmentRequirementsDataList.push({
                        departmentId: departmentId,
                        requirementCount: requirementCount,
                        studentRequirementPassedCount: studentRequirementCount
                      });
                    }
                  });
              });
          });
      });

    this.submissionDataService
      .getSubmissionData()
      .pipe(first())
      .subscribe((submissionData) => {
        this.submissionData = submissionData;
      });
  }

  getDepartmentRequirementData(departmentId: number) {
    return this.departmentRequirementsDataList.find((value) => {
      if (value.departmentId === departmentId) {
        return true;
      }
      return false;
    });
  }

  getSubmittedRequirementStringForDepartment(departmentId: number | undefined) {
    if (!departmentId) {
      return;
    }

    const data = this.getDepartmentRequirementData(departmentId);

    if (!data) {
      return;
    }

    return `${data.studentRequirementPassedCount}/${data.requirementCount}`;
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
