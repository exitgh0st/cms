import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs';
import { swalCustomClass } from 'src/app/config/swal-options';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-super-admin-students',
  templateUrl: './super-admin-students.component.html',
  styleUrls: ['./super-admin-students.component.scss']
})
export class SuperAdminStudentsComponent {
  students?: Student[];
  showCreateStudentPanel = false;
  studentForm = new FormGroup({
    studentNumber: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });
  selectedStudent?: Student;
  studentNumberForDeletion?: string;
  isLoading = false;

  constructor(private ngxSpinnerService: NgxSpinnerService, private studentService: StudentService) {
    this.ngxSpinnerService.show();
    this.fetchStudents();
  }

  fetchStudents() {
    this.studentService
      .getStudents()
      .pipe(first())
      .subscribe((students) => {
        this.students = students;
      });
  }

  createStudentWithAccount() {
    const student: Student = {
      student_number: this.studentForm.value.studentNumber ? this.studentForm.value.studentNumber : undefined,
      account: {
        role_id: 3,
        first_name: this.studentForm.value.firstName ? this.studentForm.value.firstName : undefined,
        last_name: this.studentForm.value.lastName ? this.studentForm.value.lastName : undefined,
        email: this.studentForm.value.email ? this.studentForm.value.email : undefined,
        password: this.studentForm.value.password ? this.studentForm.value.password : undefined
      }
    };

    this.isLoading = true;
    this.studentService
      .createStudentWithAccount(student)
      .pipe(first())
      .subscribe((student) => {
        this.showCreateStudentPanel = false;
        this.fetchStudents();
        this.isLoading = false;

        Swal.fire({
          title: 'Successfully created student!',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: swalCustomClass
        });
      });
  }

  clickUpdateStudentButton(student: Student) {
    this.selectedStudent = student;

    if (student.account?.first_name) {
      this.studentForm.controls.firstName.setValue(student.account.first_name);
    }

    if (student.account?.last_name) {
      this.studentForm.controls.lastName.setValue(student.account.last_name);
    }
    if (student.account?.email) {
      this.studentForm.controls.email.setValue(student.account.email);
    }
  }

  updateStudentWithAccount() {
    if (!this.selectedStudent || !this.selectedStudent.student_number) {
      return;
    }

    const studentData: Student = {
      account: {
        first_name: this.studentForm.value.firstName ? this.studentForm.value.firstName : undefined,
        last_name: this.studentForm.value.lastName ? this.studentForm.value.lastName : undefined,
        email: this.studentForm.value.email ? this.studentForm.value.email : undefined
      }
    };

    this.isLoading = true;
    this.studentService
      .updateStudentWithAccount(this.selectedStudent.student_number, studentData)
      .pipe(first())
      .subscribe(() => {
        this.fetchStudents();
        this.selectedStudent = undefined;
        this.isLoading = false;

        Swal.fire({
          title: 'Successfully updated student!',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: swalCustomClass
        });
      });
  }

  deleteStudent(studentNumber: string | undefined) {
    if (!studentNumber) {
      return;
    }

    Swal.fire({
      title: 'Are you sure you want to delete this student?',
      icon: 'question',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      customClass: swalCustomClass
    }).then((response) => {
      if (response.isConfirmed) {
        this.isLoading = true;

        this.studentService
          .deleteStudent(studentNumber)
          .pipe(first())
          .subscribe(() => {
            this.fetchStudents();
            this.isLoading = false;

            Swal.fire({
              title: 'Successfully deleted student!',
              icon: 'success',
              confirmButtonText: 'Ok',
              customClass: swalCustomClass
            });
          });
      }
    });
  }

  clickCreateStudentButton() {
    this.studentForm.controls.studentNumber.setValue('');
    this.studentForm.controls.firstName.setValue('');
    this.studentForm.controls.lastName.setValue('');
    this.studentForm.controls.email.setValue('');
    this.studentForm.controls.password.setValue('');
    this.showCreateStudentPanel = true;
  }
}
