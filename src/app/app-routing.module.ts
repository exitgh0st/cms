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
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { ErikaComponent } from './pages/erika/erika.component';
import { StudentListComponent } from './pages/student-list/student-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LandingPageComponent, canActivate: [LoginGuard] },
  { path: 'login/:loginType', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'student/dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/students', component: AdminStudentsComponent, canActivate: [AuthGuard] },
  { path: 'admin/requirements/:departmentId', component: AdminRequirementsComponent, canActivate: [AuthGuard] },
  { path: 'super-admin/dashboard', component: SuperAdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/student-list', component: StudentListComponent },

  {
    path: 'student/requirements/:departmentId',
    component: StudentDepartmentRequirementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student/profile',
    component: StudentProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'erika',
    component: ErikaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
