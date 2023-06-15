import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequirementService } from 'src/app/services/requirements.service';
import { StudentService } from 'src/app/services/student.service';
import { first, firstValueFrom, pipe } from 'rxjs';
import { Student } from 'src/app/models/student';
import { Department } from 'src/app/models/department';
import { DepartmentService } from 'src/app/services/department.service';
import { Requirement } from 'src/app/models/requirement';
import { StudentRequirementService } from 'src/app/services/student-requirement.service';
import { StudentRequirement } from 'src/app/models/student-requirement';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import { SubmissionDataService } from 'src/app/services/submission-data.service';
import { SubmissionData } from 'src/app/models/submission_data';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { swalCustomClass } from 'src/app/config/swal-options';

export type RequirementPair = {
  requirement: Requirement;
  studentRequirement?: StudentRequirement;
  fileUrl?: string | ArrayBuffer;
  fileType?: string;
  adminComments?: string | null;
  isDoneLoading?: boolean;
  uploadedFile?: File;
  fileSize?: number;
};

@Component({
  selector: 'app-student-department-requirement',
  templateUrl: './student-department-requirement.component.html',
  styleUrls: ['./student-department-requirement.component.scss']
})
export class StudentDepartmentRequirementComponent {
  student?: Student;
  department?: Department;
  requirements?: Requirement[];
  requirementPairs: RequirementPair[] = [];
  submissionData?: SubmissionData;

  doneLoading = false;

  previewFileURL?: string | ArrayBuffer;
  // isSavingChanges = false;
  currentlySaving = false;

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  constructor(
    private ngxSpinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private requirementsService: RequirementService,
    private authService: AuthService,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private studentRequirementService: StudentRequirementService,
    private googleDriveService: GoogleDriveService,
    private submissionDataService: SubmissionDataService
  ) {
    this.ngxSpinner.show();
    const accountId = this.authService.getAccountId();
    const departmentId = this.route.snapshot.paramMap.get('departmentId');

    if (!accountId || !departmentId) {
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
      .getDepartment(departmentId)
      .pipe(first())
      .subscribe((department) => {
        this.department = department;
      });

    this.requirementsService
      .getRequirementsByDepartment(parseInt(departmentId))
      .pipe(first())
      .subscribe({
        next: (requirements) => {
          this.requirements = requirements;

          if (!this.requirements.length) {
            return;
          }

          for (let requirement of requirements) {
            this.requirementPairs.push({ requirement: requirement });
          }

          this.fetchStudentRequirementsOfRequirements();
        }
      });

    this.submissionDataService
      .getSubmissionData()
      .pipe(first())
      .subscribe((submissionData) => {
        this.submissionData = submissionData;
      });
  }

  createStudentRequirement(requirement: Requirement, fileName: string, fileType: string, originalFileName: string) {
    this.studentRequirementService
      .createStudentRequirement({
        student_id: this.student?.student_number,
        requirement_id: requirement?.id,
        status_id: 1,
        file_name: fileName,
        file_type: fileType,
        original_file_name: originalFileName
      })
      .pipe(first())
      .subscribe((newStudentRequirement) => {
        alert('Done uploading!');
      });
  }

  fetchStudentRequirementsOfRequirements() {
    const requirementPairs = this.requirementPairs;

    for (let requirementPair of requirementPairs) {
      if (requirementPair.requirement.id) {
        if (!this.student?.student_number) {
          return;
        }

        this.studentRequirementService
          .getStudentRequirementByStudentIdsAndRequirementIds([this.student?.student_number], [requirementPair.requirement.id.toString()])
          .pipe(first())
          .subscribe((studentRequirements) => {
            if (studentRequirements.length > 0) {
              const studentRequirement = studentRequirements[0];

              requirementPair.studentRequirement = studentRequirement;

              if (studentRequirement.file_name) {
                this.googleDriveService.loadFile(studentRequirement.file_name).subscribe((response) => {
                  const blob = new Blob([response], { type: studentRequirement.file_type });
                  const url = URL.createObjectURL(blob);

                  requirementPair.fileUrl = url;
                  requirementPair.fileType = studentRequirement.file_type;
                  requirementPair.fileSize = blob.size;
                  requirementPair.isDoneLoading = true;
                });
              } else {
                requirementPair.isDoneLoading = true;
              }
            } else {
              requirementPair.isDoneLoading = true;
            }
          });
      }
    }
  }

  openFileInAnotherWindow(requirementPair: RequirementPair) {
    if (requirementPair.uploadedFile) {
      const url = URL.createObjectURL(requirementPair.uploadedFile);
      window.open(url, 'Preview');
    } else {
      window.open(requirementPair.fileUrl as string, 'Preview');
    }
  }

  onFileSelected(event: any, requirementPair: RequirementPair) {
    requirementPair.uploadedFile = event.target.files[0];
    requirementPair.fileType = requirementPair.uploadedFile?.type;
    const fr = new FileReader();
    fr.onload = function () {
      if (fr.result) requirementPair.fileUrl = fr.result;
    };

    fr.readAsDataURL(event.target.files[0]);
  }

  uploadFile(requirementPair: RequirementPair) {
    if (requirementPair.studentRequirement) {
      this.updateFile(requirementPair);
      return;
    }

    const requirement = requirementPair.requirement;

    if (!requirementPair.uploadedFile) {
      return;
    }

    const fileType = requirementPair.uploadedFile.type;
    const originalFileName = requirementPair.uploadedFile.name;

    return firstValueFrom(this.googleDriveService.uploadFile(requirementPair.uploadedFile)).then((response) => {
      return firstValueFrom(
        this.studentRequirementService.createStudentRequirement({
          student_id: this.student?.student_number,
          requirement_id: requirement?.id,
          status_id: 1,
          file_name: response.fileName,
          file_type: fileType,
          original_file_name: originalFileName
        })
      );
    });
  }

  updateFile(requirementPair: RequirementPair) {
    if (!requirementPair.uploadedFile) {
      return;
    }

    const fileType = requirementPair.uploadedFile.type;
    const originalFileName = requirementPair.uploadedFile.name;

    const studentRequirementId = requirementPair.studentRequirement?.id;

    if (!studentRequirementId) {
      return;
    }

    let studentRequirement: StudentRequirement;

    return firstValueFrom(this.googleDriveService.uploadFile(requirementPair.uploadedFile)).then((response) => {
      studentRequirement = {
        student_id: this.student?.student_number,
        requirement_id: requirementPair.requirement.id,
        status_id: 1,
        file_name: response.fileName,
        file_type: fileType,
        original_file_name: originalFileName
      };

      return firstValueFrom(this.studentRequirementService.updateStudentRequirement(studentRequirementId, studentRequirement));
    });
  }

  previewFile(fileUrl: string | undefined | ArrayBuffer) {
    this.previewFileURL = fileUrl;
  }

  clickGrayOverlay() {
    this.previewFileURL = undefined;
  }

  goToStudentManualPage() {
    this.router.navigate(['student', 'users-manual']);
  }

  saveChanges() {
    Swal.fire({
      title: 'Are you sure you want to save your changes?',
      icon: 'question',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      customClass: swalCustomClass
    }).then((result) => {
      if (result.isConfirmed) {
        this.currentlySaving = true;
        const promises = [];

        for (let requirementPair of this.requirementPairs) {
          if (requirementPair.studentRequirement) {
            promises.push(this.updateFile(requirementPair));
          } else {
            promises.push(this.uploadFile(requirementPair));
          }
        }

        Promise.all(promises).then((response) => {
          this.currentlySaving = false;

          Swal.fire({
            title: 'Saved!',
            icon: 'success',
            confirmButtonText: 'Continue',
            customClass: swalCustomClass
          });
          this.fetchStudentRequirementsOfRequirements();
        });
      }
    });
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
