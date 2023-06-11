import { Component } from '@angular/core';
import { Admin } from 'src/app/models/admin';

@Component({
  selector: 'app-admin-faq',
  templateUrl: './admin-faq.component.html',
  styleUrls: ['./admin-faq.component.scss']
})
export class AdminFaqComponent {
  admin?: Admin;
}
