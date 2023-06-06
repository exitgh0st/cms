import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Department } from 'src/app/models/department';
import { Requirement } from 'src/app/models/requirement';
import { Student } from 'src/app/models/student';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { StudentService } from 'src/app/services/student.service';
import { RequirementPair } from '../student-department-requirement/student-department-requirement.component';
import { DepartmentService } from 'src/app/services/department.service';
import { RequirementService } from '../../services/requirements.service';
import { StudentRequirementService } from 'src/app/services/student-requirement.service';
import jsPDF, { HTMLOptions } from 'jspdf';

type DepartmentRequirements = {
  department: Department;
  requirementPairs: RequirementPair[];
};

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent {
  student?: Student;
  departments?: Department[];
  requirements?: Requirement[];
  departmentRequirementsList: DepartmentRequirements[] = [];
  @ViewChild('profileTable') profileTable?: ElementRef;

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private requirementsService: RequirementService,
    private studentRequirementService: StudentRequirementService,
    private router: Router,
    private studentService: StudentService
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

        for (let department of departments) {
          if (department.id) {
            this.departmentRequirementsList.push({ department: department, requirementPairs: [] });
          }
        }

        this.requirementsService
          .getRequirements()
          .pipe(first())
          .subscribe({
            next: (requirements) => {
              this.requirements = requirements;

              for (let requirement of requirements) {
                if (requirement.id) {
                  this.studentRequirementService
                    .getStudentRequirementOfRequirement(requirement.id)
                    .pipe(first())
                    .subscribe((studentRequirement) => {
                      for (let departmentRequirements of this.departmentRequirementsList) {
                        if (requirement.created_by?.department?.id === departmentRequirements.department.id) {
                          departmentRequirements.requirementPairs.push({
                            requirement: requirement,
                            studentRequirement: studentRequirement
                          });
                          break;
                        }
                      }
                    });
                }
              }
            }
          });
      });
  }

  getDepartmentRequirementsStatusString(departmentRequirements: DepartmentRequirements) {
    let requirementCount = 0;
    let studentRequirementClearedCount = 0;

    for (let requirementPair of departmentRequirements.requirementPairs) {
      if (requirementPair.requirement) {
        requirementCount++;
      }

      if (requirementPair.studentRequirement?.status?.name === 'CLEARED') {
        studentRequirementClearedCount++;
      }
    }

    return `${studentRequirementClearedCount}/${requirementCount}`;
  }

  getDepartmentCheckStatus(departmentRequirements: DepartmentRequirements) {
    let requirementCount = 0;
    let studentRequirementClearedCount = 0;

    for (let requirementPair of departmentRequirements.requirementPairs) {
      if (requirementPair.requirement) {
        requirementCount++;
      }

      if (requirementPair.studentRequirement?.status?.id === 2) {
        return 'WITH PENDING';
      }

      if (requirementPair.studentRequirement?.status?.id === 3) {
        studentRequirementClearedCount++;
      }
    }

    if (studentRequirementClearedCount === requirementCount) {
      return 'DONE';
    }

    if (studentRequirementClearedCount == 0) {
      return 'NOT YET CHECKED';
    }

    if (studentRequirementClearedCount > 0) {
      return 'ONGOING';
    }

    return 'DONE';
  }

  savePDF() {
    if (!this.profileTable) {
      return;
    }

    const pdfMaker = new jsPDF('p', 'mm', 'letter');
    pdfMaker.html(this.profileTable.nativeElement, {
      html2canvas: {
        scale: 0.3
      },
      callback: function (pdfMaker: jsPDF) {
        pdfMaker.save();
      }
    });
  }
}
