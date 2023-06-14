import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { swalCustomClass } from 'src/app/config/swal-options';
import { Account } from 'src/app/models/account';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loading: boolean = false;
  unauthorized: boolean = false;
  loginType!: string;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    const loginType = this.route.snapshot.paramMap.get('loginType');

    if (!loginType || !(loginType === 'student' || loginType === 'admin')) {
      this.router.navigate(['login']);
      return;
    }

    if (loginType) this.loginType = loginType;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const account = this.loginForm.value as Account;

    if (!account.email || !account.password) {
      return;
    }

    this.loading = true;

    let role_id;
    if (this.loginType === 'student') {
      role_id = '3';
    } else {
      role_id = '2';
    }

    this.authService
      .login(account.email, account.password, role_id)
      .pipe(first())
      .subscribe({
        next: () => {
          let url = this.route.snapshot.queryParams['returnUrl'] || `/${this.loginType}/dashboard`;

          if (account.email == 'admin@admin') {
            url = '/super-admin/dashboard';
          }

          this.router.navigateByUrl(url);
        },
        error: (error: any) => {
          if (error.status == 401) {
            this.unauthorized = true;
          }
          this.loading = false;
        }
      });
  }

  getEmailErrorMessage() {
    if (this.loginForm.get('email')?.hasError('required')) {
      return 'You must enter a value';
    }

    return this.loginForm.get('email')?.hasError('email') ? 'Not a valid email' : '';
  }
}
