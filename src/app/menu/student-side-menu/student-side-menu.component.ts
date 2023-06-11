import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'student-side-menu',
  templateUrl: './student-side-menu.component.html',
  styleUrls: ['./student-side-menu.component.scss']
})
export class StudentSideMenuComponent {
  @Input() pageSelected?: 'home' | 'profile' | 'clearance' | 'contact' | 'manual' | 'faq';

  constructor(private router: Router, private authService: AuthService) {}

  goToHome() {
    if (this.pageSelected == 'home') {
      return;
    }

    this.router.navigate(['student', 'dashboard']);
  }

  goToProfile() {
    if (this.pageSelected == 'profile') {
      return;
    }
    this.router.navigate(['student', 'profile']);
  }

  goToClearance() {
    if (this.pageSelected == 'clearance') {
      return;
    }
    this.router.navigate(['student', 'clearance']);
  }

  goToContact() {
    if (this.pageSelected == 'contact') {
      return;
    }
    this.router.navigate(['student', 'contact']);
  }

  goToManual() {
    if (this.pageSelected == 'manual') {
      return;
    }
    this.router.navigate(['student', 'users-manual']);
  }

  goToFaq() {
    if (this.pageSelected == 'faq') {
      return;
    }
    this.router.navigate(['student', 'faqs']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
