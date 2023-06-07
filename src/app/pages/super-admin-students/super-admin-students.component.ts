import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { Student } from 'src/app/models/student';
import { StudentService } from 'src/app/services/student.service';

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

  constructor(private studentService: StudentService) {
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

    this.studentService
      .createStudentWithAccount(student)
      .pipe(first())
      .subscribe((student) => {
        alert('Successfully created student!');
        this.showCreateStudentPanel = false;
        this.fetchStudents();
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

    this.studentService
      .updateStudentWithAccount(this.selectedStudent.student_number, studentData)
      .pipe(first())
      .subscribe(() => {
        alert('Successfully updated student!');
        this.fetchStudents();
        this.selectedStudent = undefined;
      });
  }

  deleteStudent(studentNumber: string | undefined) {
    if (!studentNumber) {
      return;
    }

    this.studentService
      .deleteStudent(studentNumber)
      .pipe(first())
      .subscribe(() => {
        this.fetchStudents();
        alert('Succesfully deleted student!');
        this.studentNumberForDeletion = undefined;
      });
  }
}
