import { Component } from '@angular/core';
import { Admin } from 'src/app/models/admin';

@Component({
  selector: 'app-admin-users-manual',
  templateUrl: './admin-users-manual.component.html',
  styleUrls: ['./admin-users-manual.component.scss']
})
export class AdminUsersManualComponent {
  admin?: Admin;
}
