import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-faq',
  templateUrl: './admin-faq.component.html',
  styleUrls: ['./admin-faq.component.scss']
})
export class AdminFaqComponent {
  admin?: Admin;

  constructor(private router: Router, private authService: AuthService, private adminService: AdminService) {
    const accountId = authService.getAccountId();

    if (!accountId) {
      this.router.navigate(['login']);
      return;
    }

    this.adminService
      .getAdminByAccountId(accountId)
      .pipe(first())
      .subscribe((admin) => {
        this.admin = admin;
      });
  }
}