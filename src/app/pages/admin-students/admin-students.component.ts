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

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private studentService: StudentService,
    private requirementService: RequirementService,
    private studentRequirementService: StudentRequirementService,
    private changeDetectorRef: ChangeDetectorRef
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

                      this.studentRequirementService
                        .getStudentRequirementByStudentIdsAndRequirementIds(studentIds, requirementIds)
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

  getStudentRequirementsForStudent(studentId: string | undefined) {
    if (!studentId || !this.studentRequirements) {
      return;
    }

    const studentRequirements: StudentRequirement[] = [];

    for (let studentRequirement of this.studentRequirements) {
      studentRequirements.push(studentRequirement);
    }

    console.log(studentRequirements);

    return studentRequirements;
  }
}
