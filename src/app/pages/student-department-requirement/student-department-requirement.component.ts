import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequirementService } from 'src/app/services/requirements.service';
import { StudentService } from 'src/app/services/student.service';
import { first } from 'rxjs';
import { Student } from 'src/app/models/student';
import { Department } from 'src/app/models/department';
import { DepartmentService } from 'src/app/services/department.service';
import { Requirement } from 'src/app/models/requirement';
import { StudentRequirementService } from 'src/app/services/student-requirement.service';
import { StudentRequirement } from 'src/app/models/student-requirement';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import { SubmissionDataService } from 'src/app/services/submission-data.service';
import { SubmissionData } from 'src/app/models/submission_data';

export type RequirementPair = {
  requirement: Requirement;
  studentRequirement?: StudentRequirement;
  fileUrl?: string | ArrayBuffer;
  fileType?: string;
  adminComments?: string | null;
  isDoneLoading?: boolean;
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
  file?: File;
  submissionData?: SubmissionData;

  doneLoading = false;

  previewFileURL?: string | ArrayBuffer;

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  constructor(
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
        this.fetchStudentRequirementsOfRequirements();
      });
  }

  updateStudentRequirement(studentRequirementId: number, studentRequirement: StudentRequirement) {
    this.studentRequirementService
      .updateStudentRequirement(studentRequirementId, studentRequirement)
      .pipe(first())
      .subscribe(() => {
        this.fetchStudentRequirementsOfRequirements();
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
                  requirementPair.isDoneLoading = true;
                });
              } else {
                requirementPair.isDoneLoading = true;
              }
            }
          });
      }
    }
  }

  openFileInAnotherWindow(fileUrl: string | ArrayBuffer) {
    if (this.file) {
      const url = URL.createObjectURL(this.file);
      window.open(url, 'Preview');
    } else {
      window.open(fileUrl as string, 'Preview');
    }
  }

  onFileSelected(event: any, requirementPair: RequirementPair) {
    console.log('AAA');
    this.file = event.target.files[0];
    requirementPair.fileType = this.file?.type;

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

    if (!this.file) {
      alert('No file selected');
      return;
    }

    const fileType = this.file.type;
    const originalFileName = this.file.name;

    this.googleDriveService.uploadFile(this.file).subscribe({
      next: (response) => {
        alert('Done uploading!');

        this.createStudentRequirement(requirement, response.fileName, fileType, originalFileName);
      },

      error: (error) => {
        console.log(error);
      }
    });
  }

  updateFile(requirementPair: RequirementPair) {
    if (!this.file) {
      alert('No file selected');
      return;
    }

    const fileType = this.file.type;
    const originalFileName = this.file.name;

    const studentRequirementId = requirementPair.studentRequirement?.id;

    if (!studentRequirementId) {
      return;
    }

    this.googleDriveService.uploadFile(this.file).subscribe({
      next: (response) => {
        alert('Done updating uploaded picture!');

        const studentRequirement: StudentRequirement = {
          student_id: this.student?.student_number,
          requirement_id: requirementPair.requirement.id,
          status_id: 1,
          file_name: response.fileName,
          file_type: fileType,
          original_file_name: originalFileName
        };

        this.updateStudentRequirement(studentRequirementId, studentRequirement);
      },

      error: (error) => {
        console.log(error);
      }
    });
  }

  previewFile(fileUrl: string | undefined | ArrayBuffer) {
    this.previewFileURL = fileUrl;
  }

  clickGrayOverlay() {
    this.previewFileURL = undefined;
  }
}
