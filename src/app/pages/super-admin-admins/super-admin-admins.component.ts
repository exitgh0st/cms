import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { Department } from 'src/app/models/department';
import { AdminService } from 'src/app/services/admin.service';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-super-admin-admins',
  templateUrl: './super-admin-admins.component.html',
  styleUrls: ['./super-admin-admins.component.scss']
})
export class SuperAdminAdminsComponent {
  admins?: Admin[];
  departments?: Department[];
  showCreateAdminPanel = false;

  adminForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    departmentId: new FormControl(0),
    email: new FormControl(''),
    password: new FormControl('')
  });

  selectedAdmin?: Admin;
  adminIdForDeletion?: number;

  constructor(private adminService: AdminService, private departmentService: DepartmentService) {
    this.fetchAdmins();

    this.departmentService
      .getDepartments()
      .pipe(first())
      .subscribe((departments) => {
        this.departments = departments;
      });
  }

  fetchAdmins() {
    this.adminService
      .getAdmins()
      .pipe(first())
      .subscribe((admins) => {
        this.admins = admins;
      });
  }

  clickCreateAdminButton() {
    this.adminForm.controls.firstName.setValue('');
    this.adminForm.controls.lastName.setValue('');
    this.adminForm.controls.departmentId.setValue(0);
    this.adminForm.controls.email.setValue('');
    this.adminForm.controls.password.setValue('');

    this.showCreateAdminPanel = true;
  }

  createAdminWithAccount() {
    const admin: Admin = {
      department_id: this.adminForm.value.departmentId ? this.adminForm.value.departmentId : undefined,
      account: {
        role_id: 2,
        first_name: this.adminForm.value.firstName ? this.adminForm.value.firstName : undefined,
        last_name: this.adminForm.value.lastName ? this.adminForm.value.lastName : undefined,
        email: this.adminForm.value.email ? this.adminForm.value.email : undefined,
        password: this.adminForm.value.password ? this.adminForm.value.password : undefined
      }
    };

    this.adminService
      .createAdminWithAccount(admin)
      .pipe(first())
      .subscribe((admin) => {
        this.fetchAdmins();
        alert('Successfully created admin!');
        this.showCreateAdminPanel = false;
      });
  }

  clickUpdateAdminButton(admin: Admin) {
    this.selectedAdmin = admin;

    if (admin.account?.first_name) {
      this.adminForm.controls.firstName.setValue(admin.account.first_name);
    }
    if (admin.account?.last_name) {
      this.adminForm.controls.lastName.setValue(admin.account.last_name);
    }
    if (admin.department?.id) {
      this.adminForm.controls.departmentId.setValue(admin.department.id);
    }
    if (admin.account?.email) {
      this.adminForm.controls.email.setValue(admin.account.email);
    }
  }

  updateAdminWithAccount() {
    if (!this.selectedAdmin?.id) {
      return;
    }

    const admin: Admin = {
      department_id: this.adminForm.value.departmentId ? this.adminForm.value.departmentId : undefined,
      account: {
        first_name: this.adminForm.value.firstName ? this.adminForm.value.firstName : undefined,
        last_name: this.adminForm.value.lastName ? this.adminForm.value.lastName : undefined,
        email: this.adminForm.value.email ? this.adminForm.value.email : undefined
      }
    };

    this.adminService
      .updateAdminWithAccount(this.selectedAdmin.id, admin)
      .pipe(first())
      .subscribe((response) => {
        this.fetchAdmins();
        alert('Successfully updated admin!');
        this.selectedAdmin = undefined;
      });
  }

  deleteAdmin(accountId: number | undefined) {
    if (!accountId) {
      return;
    }

    this.adminService
      .deleteAdmin(accountId)
      .pipe(first())
      .subscribe(() => {
        this.fetchAdmins();
        alert('Successfully deleted admin!');
        this.adminIdForDeletion = undefined;
      });
  }
}
