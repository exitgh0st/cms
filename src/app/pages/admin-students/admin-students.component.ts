import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from 'src/app/models/admin';
import { Requirement } from 'src/app/models/requirement';
import { Student } from 'src/app/models/student';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { RequirementService } from 'src/app/services/requirements.service';
import { StudentRequirementService } from 'src/app/services/student-requirement.service';
import { StudentService } from 'src/app/services/student.service';
import { first } from 'rxjs';
import { StudentRequirement } from 'src/app/models/student-requirement';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import { RequirementPair } from '../student-department-requirement/student-department-requirement.component';

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.scss']
})
export class AdminStudentsComponent {
  admin?: Admin;
  requirements?: Requirement[];
  students?: Student[];
  studentRequirements?: StudentRequirement[];

  selectedStudent?: Student;
  selectedStudentRequirementPairs?: RequirementPair[];
  previewFileURL?: string | ArrayBuffer;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private studentService: StudentService,
    private requirementService: RequirementService,
    private studentRequirementService: StudentRequirementService,
    private changeDetectorRef: ChangeDetectorRef,
    private googleDriveService: GoogleDriveService
  ) {
    const accountId = this.authService.getAccountId();

    if (!accountId) {
      this.router.navigate(['/login']);
      return;
    }

    this.adminService
      .getAdminByAccountId(accountId)
      .pipe(first())
      .subscribe({
        next: (admin) => {
          this.admin = admin;

          if (!this.admin.department?.id) {
            this.router.navigate(['/login']);
            return;
          }

          this.studentService
            .getStudents()
            .pipe(first())
            .subscribe({
              next: (students) => {
                this.students = students;
                const studentIds: string[] = [];

                for (let student of students) {
                  if (student.student_number) {
                    studentIds.push(student.student_number);
                  }
                }

                if (!this.admin?.department?.id) {
                  this.router.navigate(['login']);
                  return;
                }

                this.requirementService
                  .getRequirementsByDepartment(this.admin.department.id)
                  .pipe(first())
                  .subscribe({
                    next: (requirements) => {
                      this.requirements = requirements;
                      const requirementIds: string[] = [];
                      for (let requirement of requirements) {
                        if (requirement.id) {
                          requirementIds.push(requirement.id.toString());
                        }
                      }

                      if (studentIds.length <= 0 || requirementIds.length <= 0) {
                        return;
                      }

                      this.fetchStudentRequirements(studentIds, requirementIds)
                        .pipe(first())
                        .subscribe((studentRequirements) => {
                          this.studentRequirements = studentRequirements;
                        });
                    }
                  });
              }
            });
        }
      });
  }

  fetchStudentRequirements(studentIds: string[], requirementIds: string[]) {
    return this.studentRequirementService.getStudentRequirementByStudentIdsAndRequirementIds(studentIds, requirementIds);
  }

  getRequirementStatusForStudent(studentId: string | undefined) {
    if (!studentId || !this.studentRequirements || !this.requirements || !this.admin) {
      return;
    }

    const studentRequirementsPassed = [];

    for (let studentRequirement of this.studentRequirements) {
      if (studentRequirement.student?.student_number !== studentId) {
        continue;
      }

      if (studentRequirement.requirement?.created_by?.department_id == this.admin.department?.id) {
        studentRequirementsPassed.push(studentRequirement);
      }
    }

    return `${studentRequirementsPassed.length}/${this.requirements.length}`;
  }

  getCheckStatusForStudent(studentId: string | undefined) {
    if (!studentId || !this.studentRequirements || !this.requirements || !this.admin) {
      return;
    }

    const studentRequirementsPassed = [];

    for (let studentRequirement of this.studentRequirements) {
      if (studentRequirement.student?.student_number !== studentId) {
        continue;
      }

      if (studentRequirement.requirement?.created_by?.department_id == this.admin.department?.id) {
        studentRequirementsPassed.push(studentRequirement);
      }
    }

    let clearCount = 0;

    for (let studentRequirement of studentRequirementsPassed) {
      if (studentRequirement.status?.id == 2) {
        return 'WITH PENDING';
      }

      if (studentRequirement.status?.id == 3) {
        clearCount++;
      }
    }

    if (clearCount == studentRequirementsPassed.length) {
      return 'DONE';
    }

    if (clearCount == 0) {
      return 'NOT YET CHECKED';
    }

    if (clearCount > 0) {
      return 'ONGOING';
    }

    return 'DONE';
  }

  selectStudent(student: Student) {
    if (!this.requirements || !student.student_number) {
      return;
    }

    this.selectedStudent = student;
    this.fetchRequirementPairs();
  }

  fetchRequirementPairs() {
    if (!this.requirements || !this.selectedStudent?.student_number || !this.students) {
      return;
    }

    const studentIds: string[] = [];

    for (let student of this.students) {
      if (student.student_number) {
        studentIds.push(student.student_number);
      }
    }

    const requirementIds: string[] = [];

    for (let requirement of this.requirements) {
      if (requirement.id) {
        requirementIds.push(requirement.id.toString());
      }
    }

    console.log(studentIds, requirementIds);

    if (studentIds.length <= 0 || requirementIds.length <= 0) {
      return;
    }

    this.fetchStudentRequirements(studentIds, requirementIds)
      .pipe(first())
      .subscribe((studentRequirements) => {
        this.studentRequirements = studentRequirements;

        studentRequirements = studentRequirements.filter((studentRequirement) => {
          if (studentRequirement.student?.student_number === this.selectedStudent?.student_number) {
            return true;
          }
          return false;
        });

        this.selectedStudentRequirementPairs = [];

        if (!this.requirements) {
          return;
        }

        for (let requirement of this.requirements) {
          let studentRequirementSelected;
          for (let studentRequirement of studentRequirements) {
            if (requirement.id === studentRequirement.requirement?.id) {
              studentRequirementSelected = studentRequirement;
              break;
            }
          }

          this.selectedStudentRequirementPairs.push({
            requirement: requirement,
            studentRequirement: studentRequirementSelected,
            adminComments: studentRequirementSelected?.admin_comments
          });
        }

        for (let selectedStudentRequirementPair of this.selectedStudentRequirementPairs) {
          if (selectedStudentRequirementPair.studentRequirement?.file_name) {
            this.googleDriveService
              .loadFile(selectedStudentRequirementPair.studentRequirement?.file_name)
              .pipe(first())
              .subscribe((file) => {
                const blob = new Blob([file], { type: 'image/jpeg' });
                const imageURL = URL.createObjectURL(blob);

                selectedStudentRequirementPair.fileUrl = imageURL;
              });
          }
        }
      });
  }

  getStudentRequirementsForStudent(studentNumber: string) {
    if (!this.studentRequirements) {
      return;
    }

    console.log('ABNO', studentNumber);

    const studentRequirements = [];

    for (let studentRequirement of this.studentRequirements) {
      if (studentRequirement.student?.student_number == studentNumber) {
        studentRequirements.push(studentRequirement);
      }
    }

    console.log('ABNO', studentRequirements);

    return studentRequirements;
  }

  getStudentRequirementForRequirement(studentNumber: string, requirementId: number) {
    if (!this.requirements) {
      return;
    }

    let studentRequirements = this.getStudentRequirementsForStudent(studentNumber);

    if (!studentRequirements) {
      studentRequirements = [];
    }

    for (let requirement of this.requirements) {
      for (let studentRequirement of studentRequirements) {
        if (studentRequirement.requirement?.id === requirement.id) {
          return studentRequirement;
        }
      }
    }

    return null;
  }

  async getPictureURLforStudentRequirement(studentRequirement: StudentRequirement | undefined | null) {
    if (!studentRequirement) {
      return;
    }

    if (!studentRequirement.file_name) {
      return undefined;
    }

    let imageUrl;

    this.googleDriveService
      .loadFile(studentRequirement.file_name)
      .pipe(first())
      .subscribe((file) => {
        console.log('xx');
      });
    // .pipe(first())
    // .subscribe((response) => {
    //   console.log(response);
    //   const blob = new Blob([response], { type: 'image/jpeg' });
    //   imageUrl = URL.createObjectURL(blob);
    // });

    return imageUrl;
  }

  setRequirementAsPending(requirementPair: RequirementPair) {
    const studentRequirement = requirementPair.studentRequirement;
    const adminComments = requirementPair.adminComments;

    if (!studentRequirement?.id) {
      return;
    }

    this.studentRequirementService
      .updateStudentRequirement(studentRequirement.id, {
        status_id: 2,
        checked_by_id: this.admin?.id,
        admin_comments: adminComments ? adminComments : undefined
      })
      .pipe(first())
      .subscribe((message) => {
        alert('Successfully set requirement to PENDING!');
        this.fetchRequirementPairs();
      });
  }

  setRequirementAsCleared(requirementPair: RequirementPair) {
    const studentRequirement = requirementPair.studentRequirement;
    const adminComments = requirementPair.adminComments;

    if (!studentRequirement?.id) {
      return;
    }

    this.studentRequirementService
      .updateStudentRequirement(studentRequirement.id, {
        status_id: 3,
        checked_by_id: this.admin?.id,
        admin_comments: adminComments ? adminComments : undefined
      })
      .pipe(first())
      .subscribe((message) => {
        alert('Successfully set requirement to CLEARED!');
        this.fetchRequirementPairs();
      });
  }

  clickGrayOverlay() {
    this.selectedStudent = undefined;
    this.selectedStudentRequirementPairs = undefined;
  }

  clickPreviewOverlay() {
    this.previewFileURL = undefined;
  }

  previewFile(fileUrl: string | undefined | ArrayBuffer) {
    this.previewFileURL = fileUrl;
  }
}
