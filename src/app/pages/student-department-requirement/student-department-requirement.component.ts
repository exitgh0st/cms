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
  adminComments?: string;
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

  createStudentRequirement(requirement: Requirement, fileName: string) {
    this.studentRequirementService
      .createStudentRequirement({
        student_id: this.student?.student_number,
        requirement_id: requirement?.id,
        status_id: 1,
        file_name: fileName
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
                  console.log(response);
                  const blob = new Blob([response], { type: 'image/jpeg' });
                  const imageURL = URL.createObjectURL(blob);

                  requirementPair.fileUrl = imageURL;
                });
              }
            }
          });
      }
    }
  }

  onFileSelected(event: any, requirementPair: RequirementPair) {
    this.file = event.target.files[0];

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
    this.googleDriveService.uploadFile(this.file).subscribe({
      next: (response) => {
        alert('Done uploading!');

        this.createStudentRequirement(requirement, response.fileName);
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

    const studentRequirementId = requirementPair.studentRequirement?.id;

    if (!studentRequirementId) {
      return;
    }
    requirementPair.fileUrl = undefined;

    this.googleDriveService.uploadFile(this.file).subscribe({
      next: (response) => {
        alert('Done updating uploaded picture!');

        const studentRequirement: StudentRequirement = {
          student_id: this.student?.student_number,
          requirement_id: requirementPair.requirement.id,
          status_id: 1,
          file_name: response.fileName
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
