import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { StudentLoginComponent } from './pages/student-login/student-login.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { StudentDepartmentRequirementComponent } from './pages/student-department-requirement/student-department-requirement.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login/student', component: StudentLoginComponent },
  { path: 'login/admin', component: AdminLoginComponent },
  { path: 'login', component: LandingPageComponent },
  { path: 'student/dashboard', component: StudentDashboardComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'super-admin/dashboard', component: SuperAdminDashboardComponent },
  {
    path: 'student/deparment/:department_id',
    component: StudentDepartmentRequirementComponent,
  },
  {
    path: 'student/profile',
    component: StudentProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
