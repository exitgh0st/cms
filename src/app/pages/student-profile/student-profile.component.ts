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
import { Pic } from '../admin-profile/admin-profile.component';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import { DatePipe } from '@angular/common';

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
  profilePic: Pic = {};
  profilePicFile?: File;
  accountId!: number;

  @ViewChild('profileTable') profileTable?: ElementRef;

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private requirementsService: RequirementService,
    private studentRequirementService: StudentRequirementService,
    private router: Router,
    private studentService: StudentService,
    private googleDriveService: GoogleDriveService,
    private accountService: AccountService,
    private datePipe: DatePipe
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

        if (student.account?.profile_picture_name) {
          this.googleDriveService
            .loadFile(student.account.profile_picture_name)
            .pipe(first())
            .subscribe((filedata) => {
              const blob = new Blob([filedata], { type: 'image/jpeg' });
              const imageURL = URL.createObjectURL(blob);

              this.profilePic.picURL = imageURL;
            });
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

  clickProfilePic() {
    if (this.profilePic) {
      this.profilePic.previewPicURL = this.profilePic.picURL;
    }
  }

  onProfilePicFileSelected(event: any, profilePic: Pic) {
    this.profilePicFile = event.target.files[0];

    const fr = new FileReader();
    fr.onload = function () {
      if (fr.result && profilePic) {
        profilePic.picURL = fr.result;
      }
    };

    fr.readAsDataURL(event.target.files[0]);
  }

  updateProfilePic() {
    if (!this.profilePicFile) {
      alert('No file selected!');
      return;
    }

    this.googleDriveService
      .uploadFile(this.profilePicFile)
      .pipe(first())
      .subscribe((response) => {
        if (response.fileName && this.accountId) {
          console.log(this.accountId);
          this.accountService
            .updateAccount(this.accountId, { profile_picture_name: response.fileName })
            .pipe(first())
            .subscribe((response) => {
              alert('Successfully updated profile pic!');
            });
        }
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

    const dateToday = this.datePipe.transform(new Date(), 'MM-DD-YYYY');
    const fileName = `Clearance Form-${this.student?.student_number}-${this.student?.account?.last_name},${this.student?.account?.first_name}-${dateToday}.pdf`;
    pdfMaker.html(this.profileTable.nativeElement, {
      html2canvas: {
        scale: 0.3
      },
      callback: function (pdfMaker: jsPDF) {
        pdfMaker.save(fileName);
      }
    });
  }
}
