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

type RequirementPair = {
  requirement: Requirement;
  studentRequirement?: StudentRequirement;
  fileUrl?: string | ArrayBuffer;
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

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requirementsService: RequirementService,
    private authService: AuthService,
    private studentService: StudentService,
    private departmentService: DepartmentService,
    private studentRequirementService: StudentRequirementService,
    private googleDriveService: GoogleDriveService
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
      .getRequirementsByDepartment(departmentId)
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

  fetchStudentRequirementsOfRequirements() {
    const requirementPairs = this.requirementPairs;

    for (let requirementPair of requirementPairs) {
      if (requirementPair.requirement.id) {
        this.studentRequirementService
          .getStudentRequirementOfRequirement(requirementPair.requirement.id)
          .pipe(first())
          .subscribe((studentRequirement) => {
            if (Object.keys(studentRequirement).length) {
              requirementPair.studentRequirement = studentRequirement;

              if (studentRequirement.file_name) {
                this.googleDriveService.loadFIle(studentRequirement.file_name).subscribe((response) => {
                  console.log(response);

                  const reader = new FileReader();
                  reader.onload = (e) => {
                    if (reader.result) {
                      requirementPair.fileUrl = reader.result;
                    }
                  };
                  reader.readAsDataURL(response);
                });
              }
            }
          });
      }
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  uploadFile(requirement: Requirement) {
    if (!this.file) {
      alert('No file selected');
      return;
    }
    this.googleDriveService.uploadFile(this.file).subscribe({
      next: (response) => {
        console.log(response);

        this.createStudentRequirement(requirement, response.fileName);
      },

      error: (error) => {
        console.log(error);
      }
    });
  }
}
