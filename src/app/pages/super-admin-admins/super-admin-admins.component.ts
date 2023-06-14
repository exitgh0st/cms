import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { Department } from 'src/app/models/department';
import { AdminService } from 'src/app/services/admin.service';
import { DepartmentService } from 'src/app/services/department.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { swalCustomClass } from 'src/app/config/swal-options';

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
  isLoading = false;

  constructor(private ngxSpinner: NgxSpinnerService, private adminService: AdminService, private departmentService: DepartmentService) {
    this.ngxSpinner.show();
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

    this.isLoading = true;

    this.adminService
      .createAdminWithAccount(admin)
      .pipe(first())
      .subscribe((admin) => {
        this.fetchAdmins();
        this.showCreateAdminPanel = false;
        Swal.fire({
          title: 'Successfully created admin!',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: swalCustomClass
        });
        this.isLoading = false;
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

    this.isLoading = true;

    this.adminService
      .updateAdminWithAccount(this.selectedAdmin.id, admin)
      .pipe(first())
      .subscribe((response) => {
        this.fetchAdmins();
        this.selectedAdmin = undefined;
        this.isLoading = false;

        Swal.fire({
          title: 'Successfully updated admin!',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: swalCustomClass
        });
      });
  }

  deleteAdmin(accountId: number | undefined) {
    if (!accountId) {
      return;
    }

    Swal.fire({
      title: 'Are you sure you want to delete this admin?',
      icon: 'question',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      customClass: swalCustomClass
    }).then((response) => {
      if (response.isConfirmed) {
        this.isLoading = true;
        this.adminService
          .deleteAdmin(accountId)
          .pipe(first())
          .subscribe(() => {
            this.isLoading = false;

            this.fetchAdmins();
            Swal.fire({
              title: 'Successfully deleted admin!',
              icon: 'success',
              confirmButtonText: 'Ok',
              customClass: swalCustomClass
            });
          });
      }
    });
  }
}
