import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'admin-side-menu',
  templateUrl: './admin-side-menu.component.html',
  styleUrls: ['./admin-side-menu.component.scss'],
  host: {
    position: 'fixed'
  }
})
export class AdminSideMenuComponent {
  @Input() pageSelected?: 'home' | 'profile' | 'requirements' | 'students' | 'manual' | 'faq';
  @Input() departmentId?: number;
  constructor(private router: Router, private authService: AuthService) {}

  goToHome() {
    if (this.pageSelected == 'home') {
      return;
    }

    this.router.navigate(['admin', 'dashboard']);
  }

  goToProfile() {
    if (this.pageSelected == 'profile') {
      return;
    }
    this.router.navigate(['admin', 'profile']);
  }

  goToRequirementsList() {
    if (this.pageSelected == 'requirements') {
      return;
    }
    this.router.navigate(['admin', 'requirements', this.departmentId]);
  }

  goToStudentsList() {
    if (this.pageSelected == 'students') {
      return;
    }
    this.router.navigate(['admin', 'students']);
  }

  goToManual() {
    if (this.pageSelected == 'manual') {
      return;
    }
    this.router.navigate(['admin', 'users-manual']);
  }

  goToFaq() {
    if (this.pageSelected == 'faq') {
      return;
    }
    this.router.navigate(['admin', 'faqs']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
