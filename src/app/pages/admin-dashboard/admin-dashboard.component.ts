import { Component } from '@angular/core';
import { Admin } from 'src/app/models/admin';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  admin?: Admin;

  constructor(private adminService: AdminService, private authService: AuthService, private router: Router) {
    const accountId = this.authService.getAccountId();

    if (!accountId) {
      this.router.navigate(['login']);
      return;
    }

    this.adminService
      .getAdminByAccountId(accountId)
      .pipe(first())
      .subscribe({
        next: (admin) => {
          this.admin = admin;
        }
      });
  }

  goToStudentList() {
    this.router.navigate(['admin', 'students']);
  }

  goToRequirementsList() {
    if (!this.admin?.department?.id) {
      alert('Admin has no department set.');
      return;
    }

    this.router.navigate(['admin', 'requirements', this.admin?.department?.id]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
