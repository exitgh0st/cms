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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { ErikaComponent } from './pages/erika/erika.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from './pages/login/login.component';
import { MatTableModule } from '@angular/material/table';
import { StudentsComponent } from './pages/students/students.component';
import { AdminRequirementsComponent } from './pages/admin-requirements/admin-requirements.component';
import { AdminStudentsComponent } from './pages/admin-students/admin-students.component';
import { AuthService } from './services/auth.service';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DatePipe } from '@angular/common';
import { SuperAdminStudentsComponent } from './pages/super-admin-students/super-admin-students.component';
import { SuperAdminAdminsComponent } from './pages/super-admin-admins/super-admin-admins.component';
import { MatSelectModule } from '@angular/material/select';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';

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
    AdminStudentsComponent,
    ErikaComponent,
    StudentListComponent,
    SuperAdminStudentsComponent,
    SuperAdminAdminsComponent,
    AdminProfileComponent
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
    FormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSelectModule
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
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
