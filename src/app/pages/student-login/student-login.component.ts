import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/student';
import { StudentAuthService } from 'src/app/services/student-auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent {
  loading: boolean = false;

  studentForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('')
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentAuthService: StudentAuthService
  ) {}

  login() {
    if (this.studentForm.invalid) {
      return;
    }

    const student = this.studentForm.value as Student;

    if (!student.email || student.password == undefined) {
      return;
    }

    this.loading = true;

    this.studentAuthService
      .login(student.email, student.password)
      .pipe(first())
      .subscribe(() => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/student/dashboard';
        this.router.navigateByUrl(returnUrl);
      });
  }

  getEmailErrorMessage() {
    if (this.studentForm.get('email')?.hasError('required')) {
      return 'You must enter a value';
    }

    return this.studentForm.get('email')?.hasError('email') ? 'Not a valid email' : '';
  }
}
