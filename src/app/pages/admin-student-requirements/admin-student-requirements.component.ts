import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin } from 'src/app/models/admin';
import { AuthService } from 'src/app/services/auth.service';
import { RequirementService } from 'src/app/services/requirements.service';
import { StudentRequirementService } from 'src/app/services/student-requirement.service';
import { StudentService } from 'src/app/services/student.service';
import { first, pipe } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { Requirement } from 'src/app/models/requirement';
import { Student } from 'src/app/models/student';
import { RequirementPair } from '../student-department-requirement/student-department-requirement.component';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import { StudentRequirement } from 'src/app/models/student-requirement';
import { SubmissionData } from 'src/app/models/submission_data';
import { SubmissionDataService } from 'src/app/services/submission-data.service';
import Swal from 'sweetalert2';
import { swalCustomClass } from 'src/app/config/swal-options';

@Component({
  selector: 'app-admin-student-requirements',
  templateUrl: './admin-student-requirements.component.html',
  styleUrls: ['./admin-student-requirements.component.scss']
})
export class AdminStudentRequirementsComponent {
  admin?: Admin;
  student?: Student;
  requirements?: Requirement[];
  previewFileURL?: string | ArrayBuffer;
  studentRequirementPairs?: RequirementPair[];
  submissionData?: SubmissionData;
  isSavingChanges = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private requirementService: RequirementService,
    private studentRequirementService: StudentRequirementService,
    private authService: AuthService,
    private adminService: AdminService,
    private googleDriveService: GoogleDriveService,
    private submissionDataServive: SubmissionDataService
  ) {
    const studentNumber = this.route.snapshot.paramMap.get('studentNumber');
    const adminId = this.authService.getAccountId();

    if (!adminId) {
      this.router.navigate(['login']);
      return;
    }

    if (!studentNumber) {
      this.router.navigate(['admin', 'dashboard']);
      return;
    }

    this.studentService
      .getStudent(studentNumber)
      .pipe(first())
      .subscribe((student) => {
        this.student = student;
      });

    this.submissionDataServive
      .getSubmissionData()
      .pipe(first())
      .subscribe((submissionData) => {
        this.submissionData = submissionData;
      });

    this.adminService
      .getAdminByAccountId(adminId)
      .pipe(first())
      .subscribe((admin) => {
        this.admin = admin;

        if (!this.admin.department?.id) {
          alert('Error with admin details.');
          return;
        }

        this.requirementService
          .getRequirementsByDepartment(this.admin.department.id)
          .pipe(first())
          .subscribe({
            next: (requirements) => {
              this.requirements = requirements;
              const requirementIds: string[] = [];

              if (this.requirements.length <= 0) {
                return;
              }

              for (let requirement of requirements) {
                if (requirement.id) {
                  requirementIds.push(requirement.id.toString());
                }
              }

              this.studentRequirementService
                .getStudentRequirementByStudentIdsAndRequirementIds([studentNumber], requirementIds)
                .pipe(first())
                .subscribe((studentRequirements) => {
                  if (!this.requirements) {
                    return;
                  }

                  this.studentRequirementPairs = [];

                  for (let requirement of this.requirements) {
                    let studentRequirementSelected;
                    for (let studentRequirement of studentRequirements) {
                      if (requirement.id === studentRequirement.requirement?.id) {
                        studentRequirementSelected = studentRequirement;
                        break;
                      }
                    }

                    this.studentRequirementPairs.push({
                      requirement: requirement,
                      studentRequirement: studentRequirementSelected,
                      adminComments: studentRequirementSelected?.admin_comments,
                      fileType: studentRequirementSelected?.file_type
                    });
                  }

                  for (let selectedStudentRequirementPair of this.studentRequirementPairs) {
                    if (selectedStudentRequirementPair.studentRequirement?.file_name) {
                      this.googleDriveService
                        .loadFile(selectedStudentRequirementPair.studentRequirement?.file_name)
                        .pipe(first())
                        .subscribe((file) => {
                          const blob = new Blob([file], { type: selectedStudentRequirementPair.fileType });
                          const imageURL = URL.createObjectURL(blob);

                          selectedStudentRequirementPair.fileUrl = imageURL;
                          selectedStudentRequirementPair.fileSize = blob.size;
                          selectedStudentRequirementPair.isDoneLoading = true;
                        });
                    }
                  }
                });
            }
          });
      });
  }

  getRequirementStatus() {
    if (!this.studentRequirementPairs || !this.requirements) {
      return;
    }

    let studentRequirementsPassed = 0;

    const requirementsCount = this.requirements.length;

    for (let studentRequirementPair of this.studentRequirementPairs) {
      if (studentRequirementPair.studentRequirement) {
        studentRequirementsPassed++;
      }
    }

    return `${studentRequirementsPassed}/${requirementsCount}`;
  }

  getCheckStatus() {
    if (!this.studentRequirementPairs || !this.requirements) {
      return;
    }

    let clearCount = 0;

    for (let studentRequirement of this.studentRequirementPairs) {
      if (!studentRequirement.studentRequirement) {
        continue;
      }

      if (studentRequirement.studentRequirement.status?.id == 2) {
        return 'WITH PENDING';
      }

      if (studentRequirement.studentRequirement.status?.id == 3) {
        clearCount++;
      }
    }

    if (clearCount == this.requirements.length) {
      return 'DONE';
    }

    if (clearCount == 0) {
      return 'NOT YET CHECKED';
    }

    if (clearCount > 0) {
      return 'IN PROGRESS';
    }

    return 'DONE';
  }

  previewFile(url: string | ArrayBuffer) {
    window.open(url as string, 'Preview');
  }

  setToPending(studentRequirement: StudentRequirement) {
    if (studentRequirement.status) {
      studentRequirement.status_id = 2;
      studentRequirement.status.id = 2;
      studentRequirement.status.name = 'PENDING';
    }
  }

  setToCleared(studentRequirement: StudentRequirement) {
    if (studentRequirement.status) {
      studentRequirement.status_id = 3;
      studentRequirement.status.id = 3;
      studentRequirement.status.name = 'CLEARED';
    }
  }

  saveChanges() {
    if (!this.studentRequirementPairs) {
      return;
    }

    const studentRequirements: StudentRequirement[] = [];

    for (let studentRequirementPair of this.studentRequirementPairs) {
      if (studentRequirementPair.studentRequirement) {
        const studentRequirement: StudentRequirement = {
          id: studentRequirementPair.studentRequirement.id,
          status_id: studentRequirementPair.studentRequirement.status?.id,
          checked_by_id: this.admin?.id,
          admin_comments: studentRequirementPair.adminComments ? studentRequirementPair.adminComments : null
        };

        studentRequirements.push(studentRequirement);
      }
    }

    Swal.fire({
      title: 'Are you sure you want to save your changes?',
      icon: 'question',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      customClass: swalCustomClass
    }).then((response) => {
      if (response.isConfirmed) {
        this.studentRequirementService
          .updateStudentRequirements(studentRequirements)
          .pipe(first())
          .subscribe(() => {
            this.isSavingChanges = false;

            Swal.fire({
              title: 'Successfully saved changes!',
              icon: 'success',
              confirmButtonText: 'Ok',
              customClass: swalCustomClass
            });
          });
      }
    });
  }

  goToClearanceList() {
    this.router.navigate(['admin', 'requirements', this.admin?.department?.id]);
  }

  niceBytes(n: number | undefined) {
    if (!n) {
      return;
    }

    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let l = 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
  }
}
