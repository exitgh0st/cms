import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { StudentDepartmentRequirementComponent } from './pages/student-department-requirement/student-department-requirement.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from './pages/login/login.component';
import { MatTableModule } from '@angular/material/table';
import { StudentsComponent } from './pages/students/students.component';
import { AdminRequirementsComponent } from './pages/admin-requirements/admin-requirements.component';
import { AdminStudentsComponent } from './pages/admin-students/admin-students.component';
import { AuthService } from './services/auth.service';

export function initApp(authService: AuthService) {
  return () => authService.autoLogin();
}

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    AdminDashboardComponent,
    SuperAdminDashboardComponent,
    StudentDashboardComponent,
    StudentDepartmentRequirementComponent,
    StudentProfileComponent,
    LoginComponent,
    StudentsComponent,
    AdminRequirementsComponent,
    AdminStudentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
