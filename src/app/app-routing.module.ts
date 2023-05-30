import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { StudentDepartmentRequirementComponent } from './pages/student-department-requirement/student-department-requirement.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminStudentsComponent } from './pages/admin-students/admin-students.component';
import { AdminRequirementsComponent } from './pages/admin-requirements/admin-requirements.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LandingPageComponent },
  { path: 'login/:loginType', component: LoginComponent },
  { path: 'student/dashboard', component: StudentDashboardComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/students', component: AdminStudentsComponent },
  { path: 'admin/requirements/:departmentId', component: AdminRequirementsComponent },
  { path: 'super-admin/dashboard', component: SuperAdminDashboardComponent },
  {
    path: 'student/requirements/:departmentId',
    component: StudentDepartmentRequirementComponent
  },
  {
    path: 'student/profile',
    component: StudentProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
