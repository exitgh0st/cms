import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { first } from 'rxjs';
import { Department } from 'src/app/models/department';
import { Student } from 'src/app/models/student';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { RequirementService } from 'src/app/services/requirements.service';
import { StudentRequirementService } from 'src/app/services/student-requirement.service';
import { StudentService } from 'src/app/services/student.service';
import { RequirementPair } from '../student-department-requirement/student-department-requirement.component';
import { Requirement } from 'src/app/models/requirement';
import { AdminService } from 'src/app/services/admin.service';
import { Admin } from 'src/app/models/admin';
import { GoogleDriveService } from 'src/app/services/google-drive.service';

type DepartmentRequirements = {
  department: Department;
  requirementPairs: RequirementPair[];
};

type AdminPair = {
  admin: Admin;
  e_signature_url?: string;
};

@Component({
  selector: 'app-student-clearance',
  templateUrl: './student-clearance.component.html',
  styleUrls: ['./student-clearance.component.scss']
})
export class StudentClearanceComponent {
  accountId!: number;
  student?: Student;
  departments?: Department[];
  requirements?: Requirement[];
  departmentRequirementsList: DepartmentRequirements[] = [];
  admins?: Admin[];
  adminPairs: AdminPair[] = [];

  @ViewChild('clearanceForm') clearanceForm?: ElementRef;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private authService: AuthService,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private requirementsService: RequirementService,
    private studentRequirementService: StudentRequirementService,
    private adminService: AdminService,
    private googleDriveService: GoogleDriveService
  ) {
    const accountId = this.authService.getAccountId();

    if (!accountId) {
      this.router.navigate(['login']);
      return;
    }

    this.accountId = accountId;

    this.studentService
      .getStudentByAccountId(accountId)
      .pipe(first())
      .subscribe((student) => {
        this.student = student;
      });

    this.adminService
      .getAdmins()
      .pipe(first())
      .subscribe((admins) => {
        this.admins = admins;

        for (let admin of admins) {
          if (admin.e_signature_name) {
            this.googleDriveService
              .loadFile(admin.e_signature_name)
              .pipe(first())
              .subscribe((filedata) => {
                const blob = new Blob([filedata], { type: 'image/jpeg' });
                const imageURL = URL.createObjectURL(blob);

                this.adminPairs?.push({ admin: admin, e_signature_url: imageURL });
              });
          } else {
            this.adminPairs?.push({ admin: admin });
          }
        }
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

  isDepartmentCleared(departmentId: number) {
    if (this.departmentRequirementsList.length <= 0) {
      return;
    }
    let departmentRequirements;

    for (let departmentRequirementsLooped of this.departmentRequirementsList) {
      if (departmentRequirementsLooped.department.id === departmentId) {
        departmentRequirements = departmentRequirementsLooped;
        break;
      }
    }

    if (!departmentRequirements) {
      return;
    }

    let requirementCount = 0;
    let studentRequirementClearedCount = 0;

    for (let requirementPair of departmentRequirements.requirementPairs) {
      if (requirementPair.requirement) {
        requirementCount++;
      }

      if (requirementPair.studentRequirement?.status?.id === 2) {
        return false;
      }

      if (requirementPair.studentRequirement?.status?.id === 3) {
        studentRequirementClearedCount++;
      }
    }

    if (studentRequirementClearedCount === requirementCount) {
      console.log(studentRequirementClearedCount, requirementCount);
      return true;
    }

    return false;
  }

  getAdminPairWithDepartmentId(departmentId: number) {
    for (let adminPair of this.adminPairs) {
      if (adminPair.admin.department?.id === departmentId) {
        if (adminPair.e_signature_url) {
          return adminPair.e_signature_url;
        }
      }
    }

    return 'assets/img/e-signature.png';
  }

  savePDF() {
    if (!this.clearanceForm) {
      return;
    }

    const pdfMaker = new jsPDF('p', 'mm', 'letter');

    const dateToday = this.datePipe.transform(new Date(), 'MM-dd-YYYY');
    const fileName = `Clearance Form-${this.student?.student_number}-${this.student?.account?.last_name},${this.student?.account?.first_name}-${dateToday}.pdf`;
    pdfMaker.html(this.clearanceForm.nativeElement, {
      html2canvas: {
        scale: 0.18
      },
      callback: function (pdfMaker: jsPDF) {
        pdfMaker.save(fileName.toUpperCase());
      }
    });
  }
}
