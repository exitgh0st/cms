import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Admin } from 'src/app/models/admin';
import { AccountService } from 'src/app/services/account.service';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleDriveService } from 'src/app/services/google-drive.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { swalCustomClass } from 'src/app/config/swal-options';

export type Pic = {
  picURL?: string | ArrayBuffer;
  previewPicURL?: string | ArrayBuffer;
};

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent {
  accountId!: number;
  admin?: Admin;
  profilePic: Pic = {};
  eSignaturePic: Pic = {};
  profilePicFile?: File;
  eSignatureFile?: File;
  currentlySaving = false;

  constructor(
    private ngxSpinnerService: NgxSpinnerService,
    private accountService: AccountService,
    private googleDriveService: GoogleDriveService,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) {
    ngxSpinnerService.show();
    const accountId = this.authService.getAccountId();

    if (!accountId) {
      this.router.navigate(['login']);
      return;
    }

    this.accountId = accountId;
    this.fetchAdmin(this.accountId);
  }

  fetchAdmin(accountId: number) {
    this.adminService
      .getAdminByAccountId(accountId)
      .pipe(first())
      .subscribe((admin) => {
        this.admin = admin;

        if (admin.account?.profile_picture_name) {
          this.googleDriveService
            .loadFile(admin.account.profile_picture_name)
            .pipe(first())
            .subscribe((filedata) => {
              const blob = new Blob([filedata], { type: 'image/jpeg' });
              const imageURL = URL.createObjectURL(blob);

              this.profilePic.picURL = imageURL;
            });
        }

        if (admin.e_signature_name) {
          this.googleDriveService
            .loadFile(admin.e_signature_name)
            .pipe(first())
            .subscribe((filedata) => {
              const blob = new Blob([filedata], { type: 'image/jpeg' });
              const imageURL = URL.createObjectURL(blob);

              this.eSignaturePic.picURL = imageURL;
            });
        }
      });
  }

  onProfilePicFileSelected(event: any, profilePic?: Pic) {
    this.profilePicFile = event.target.files[0];

    const fr = new FileReader();
    fr.onload = function () {
      if (fr.result && profilePic) {
        profilePic.picURL = fr.result;
      }
    };

    fr.readAsDataURL(event.target.files[0]);
  }

  clickProfilePic() {
    if (this.profilePic) {
      this.profilePic.previewPicURL = this.profilePic.picURL;
    }
  }

  updateProfilePic() {
    if (!this.profilePicFile) {
      Swal.fire({
        title: 'No file selected!',
        icon: 'error',
        confirmButtonText: 'Continue',
        customClass: swalCustomClass
      });
      return;
    }

    const profilePicFile = this.profilePicFile;

    Swal.fire({
      title: 'Are you sure you want to update your profile picture?',
      icon: 'question',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      customClass: swalCustomClass
    }).then((response) => {
      if (response.isConfirmed) {
        this.currentlySaving = true;

        this.googleDriveService
          .uploadFile(profilePicFile)
          .pipe(first())
          .subscribe((response) => {
            if (response.fileName && this.accountId) {
              this.accountService
                .updateAccount(this.accountId, { profile_picture_name: response.fileName })
                .pipe(first())
                .subscribe((response) => {
                  this.currentlySaving = false;

                  Swal.fire({
                    title: 'Successfully updated profile picture!',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    customClass: swalCustomClass
                  });
                  this.fetchAdmin(this.accountId);
                });
            }
          });
      }
    });
  }

  clickESignaturePic() {
    this.eSignaturePic.previewPicURL = this.eSignaturePic.picURL;
  }

  onESignatureFileSelected(event: any, eSignaturePic: Pic) {
    this.eSignatureFile = event.target.files[0];

    const fr = new FileReader();
    fr.onload = function () {
      if (fr.result && eSignaturePic) {
        eSignaturePic.picURL = fr.result;
      }
    };

    fr.readAsDataURL(event.target.files[0]);
  }

  updateESignaturePic() {
    if (!this.eSignatureFile) {
      Swal.fire({
        title: 'No file selected!',
        icon: 'error',
        confirmButtonText: 'Continue',
        customClass: swalCustomClass
      });
      return;
    }

    const eSignatureFile = this.eSignatureFile;

    Swal.fire({
      title: 'Are you sure you want to update your e-signature?',
      icon: 'question',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      customClass: swalCustomClass
    }).then((response) => {
      if (response.isConfirmed) {
        this.currentlySaving = true;
        this.googleDriveService
          .uploadFile(eSignatureFile)
          .pipe(first())
          .subscribe((response) => {
            if (response.fileName && this.admin?.id) {
              this.adminService
                .updateAdmin(this.admin.id, { e_signature_name: response.fileName })
                .pipe(first())
                .subscribe((response) => {
                  this.currentlySaving = false;

                  Swal.fire({
                    title: 'Successfully updated e-signature!',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    customClass: swalCustomClass
                  });
                  this.fetchAdmin(this.accountId);
                });
            }
          });
      }
    });
  }
}
