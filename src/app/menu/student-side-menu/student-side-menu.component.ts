import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'student-side-menu',
  templateUrl: './student-side-menu.component.html',
  styleUrls: ['./student-side-menu.component.scss']
})
export class StudentSideMenuComponent {
  @Input() pageSelected?: 'home' | 'profile' | 'faqs' | 'contact';

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

  goToFaqs() {
    if (this.pageSelected == 'faqs') {
      return;
    }
    this.router.navigate(['student', 'faqs']);
  }

  goToContact() {
    if (this.pageSelected == 'contact') {
      return;
    }
    this.router.navigate(['student', 'contact']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
