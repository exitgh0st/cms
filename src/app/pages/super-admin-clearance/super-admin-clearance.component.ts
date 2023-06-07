import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { SubmissionData } from 'src/app/models/submission_data';
import { AuthService } from 'src/app/services/auth.service';
import { SubmissionDataService } from 'src/app/services/submission-data.service';

@Component({
  selector: 'app-super-admin-clearance',
  templateUrl: './super-admin-clearance.component.html',
  styleUrls: ['./super-admin-clearance.component.scss']
})
export class SuperAdminClearanceComponent {
  submissionData?: SubmissionData;

  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;

  constructor(private router: Router, private authService: AuthService, private submissionDataService: SubmissionDataService) {
    this.fetchSubmissionData();
  }

  fetchSubmissionData() {
    this.submissionDataService
      .getSubmissionData()
      .pipe(first())
      .subscribe((submissionData) => {
        this.submissionData = submissionData;
        this.isActive = submissionData.is_active;
      });
  }

  updateSubmissionData() {
    const startDate = this.startDate ? this.startDate.toISOString() : undefined;
    const endDate = this.endDate ? this.endDate.toISOString() : undefined;

    const submissionData = {
      date_start: startDate,
      date_end: endDate,
      is_active: this.isActive ? true : false
    };

    this.submissionDataService
      .updateSubmissionData(submissionData)
      .pipe(first())
      .subscribe(() => {
        alert('Successfully updated!');
        this.fetchSubmissionData();
      });
  }

  getDate(isoStringDate: string | undefined) {
    if (!isoStringDate) {
      return;
    }

    return new Date(isoStringDate);
  }
}
