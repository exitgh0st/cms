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
import { StudentListComponent } from './pages/student-list/student-list.component';
import { SuperAdminStudentsComponent } from './pages/super-admin-students/super-admin-students.component';
import { SuperAdminAdminsComponent } from './pages/super-admin-admins/super-admin-admins.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';
import { SuperAdminClearanceComponent } from './pages/super-admin-clearance/super-admin-clearance.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { StudentClearanceComponent } from './pages/student-clearance/student-clearance.component';
import { StudentFaqComponent } from './pages/student-faq/student-faq.component';
import { StudentUsersManualComponent } from './pages/student-users-manual/student-users-manual.component';
import { SuperAdminFaqComponent } from './pages/super-admin-faq/super-admin-faq.component';
import { SuperAdminUsersManualComponent } from './pages/super-admin-users-manual/super-admin-users-manual.component';
import { AdminFaqComponent } from './pages/admin-faq/admin-faq.component';
import { AdminUsersManualComponent } from './pages/admin-users-manual/admin-users-manual.component';
import { AdminStudentRequirementsComponent } from './pages/admin-student-requirements/admin-student-requirements.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LandingPageComponent, canActivate: [LoginGuard] },
  { path: 'login/:loginType', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'student/dashboard',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'student'
    }
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'clearance_admin'
    }
  },
  {
    path: 'admin/students',
    component: AdminStudentsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'clearance_admin'
    }
  },
  {
    path: 'admin/requirements/:departmentId',
    component: AdminRequirementsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'clearance_admin'
    }
  },
  {
    path: 'admin/profile',
    component: AdminProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'clearance_admin'
    }
  },
  {
    path: 'admin/student-list',
    component: StudentListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'clearance_admin'
    }
  },
  {
    path: 'admin/faqs',
    component: AdminFaqComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'clearance_admin'
    }
  },
  {
    path: 'admin/users-manual',
    component: AdminUsersManualComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'clearance_admin'
    }
  },

  {
    path: 'admin/students/:studentNumber',
    component: AdminStudentRequirementsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'clearance_admin'
    }
  },
  {
    path: 'super-admin/dashboard',
    component: SuperAdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'super_admin'
    }
  },
  {
    path: 'super-admin/clearance',
    component: SuperAdminClearanceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'super_admin'
    }
  },

  {
    path: 'super-admin/students',
    component: SuperAdminStudentsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'super_admin'
    }
  },
  {
    path: 'super-admin/admins',
    component: SuperAdminAdminsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'super_admin'
    }
  },
  {
    path: 'super-admin/faqs',
    component: SuperAdminFaqComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'super_admin'
    }
  },
  {
    path: 'super-admin/users-manual',
    component: SuperAdminUsersManualComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'super_admin'
    }
  },
  {
    path: 'student/requirements/:departmentId',
    component: StudentDepartmentRequirementComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'student'
    }
  },
  {
    path: 'student/profile',
    component: StudentProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'student'
    }
  },
  {
    path: 'student/clearance',
    component: StudentClearanceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'student'
    }
  },
  {
    path: 'student/contact',
    component: ContactPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'student'
    }
  },
  {
    path: 'student/faqs',
    component: StudentFaqComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'student'
    }
  },
  {
    path: 'student/users-manual',
    component: StudentUsersManualComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'student'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
