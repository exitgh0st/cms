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
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { swalCustomClass } from 'src/app/config/swal-options';

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
  currentlySaving = false;

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
    private datePipe: DatePipe,
    private ngxSpinnerService: NgxSpinnerService
  ) {
    this.ngxSpinnerService.show();
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
                      let studentReq = undefined;

                      if (Object.keys(studentRequirement).length > 0) {
                        studentReq = studentRequirement;
                      }

                      for (let departmentRequirements of this.departmentRequirementsList) {
                        if (requirement.created_by?.department?.id === departmentRequirements.department.id) {
                          departmentRequirements.requirementPairs.push({
                            requirement: requirement,
                            studentRequirement: studentReq
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
      Swal.fire({
        title: 'No file selected!',
        icon: 'error',
        confirmButtonText: 'Continue',
        customClass: swalCustomClass
      });
      return;
    }

    const profilePicFile = this.profilePicFile;

    Swal.fire({
      title: 'Are you sure you want to update your profile picture?',
      icon: 'question',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      customClass: swalCustomClass
    }).then((response) => {
      if (response.isConfirmed) {
        this.currentlySaving = true;

        this.googleDriveService
          .uploadFile(profilePicFile)
          .pipe(first())
          .subscribe((response) => {
            if (response.fileName && this.accountId) {
              console.log(this.accountId);
              this.accountService
                .updateAccount(this.accountId, { profile_picture_name: response.fileName })
                .pipe(first())
                .subscribe((response) => {
                  this.currentlySaving = false;
                  Swal.fire({
                    title: 'Successfully updated profile picture!',
                    icon: 'success',
                    confirmButtonText: 'Salamat Tiger',
                    customClass: swalCustomClass
                  });
                });
            }
          });
      }
    });
  }

  getDepartmentRequirementsStatusString(departmentRequirements: DepartmentRequirements) {
    let requirementCount = 0;
    let studentRequirementPassedCount = 0;

    for (let requirementPair of departmentRequirements.requirementPairs) {
      if (requirementPair.requirement) {
        requirementCount++;
      }

      if (requirementPair.studentRequirement) {
        console.log(requirementPair.studentRequirement);
        studentRequirementPassedCount++;
      }
    }

    return `${studentRequirementPassedCount}/${requirementCount}`;
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

  goToRequirementDepartment(departmentId: number | undefined) {
    if (!departmentId) {
      return;
    }

    this.router.navigate(['student', 'requirements', departmentId]);
  }
}
