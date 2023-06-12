import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/models/department';
import { DepartmentService } from 'src/app/services/department.service';
import { first } from 'rxjs';
import { Requirement } from 'src/app/models/requirement';
import { RequirementService } from 'src/app/services/requirements.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Admin } from 'src/app/models/admin';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { SubmissionDataService } from 'src/app/services/submission-data.service';
import { SubmissionData } from 'src/app/models/submission_data';

@Component({
  selector: 'app-admin-requirements',
  templateUrl: './admin-requirements.component.html',
  styleUrls: ['./admin-requirements.component.scss']
})
export class AdminRequirementsComponent {
  department?: Department;
  requirements?: Requirement[];
  departmentId?: string;
  submissionData?: SubmissionData;

  displayedTableColumns = ['id', 'created_by', 'name', 'description'];
  selectedRequirement?: Requirement;
  admin?: Admin;

  showCreatePanel = false;

  requirementForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private departmentService: DepartmentService,
    private requirementService: RequirementService,
    private adminService: AdminService,
    private submissionDataService: SubmissionDataService
  ) {
    const departmentId = this.route.snapshot.paramMap.get('departmentId');
    const authId = this.authService.getAccountId();

    if (!departmentId || !authId) {
      this.router.navigate(['admin', 'dashboard']);
      return;
    }

    this.adminService
      .getAdminByAccountId(authId)
      .pipe(first())
      .subscribe((admin) => {
        this.admin = admin;
      });

    this.submissionDataService
      .getSubmissionData()
      .pipe(first())
      .subscribe((submissionData) => {
        this.submissionData = submissionData;
      });

    this.departmentId = departmentId;
    this.fetchRequirements();
  }

  fetchRequirements() {
    if (!this.departmentId) {
      return;
    }

    this.departmentService
      .getDepartment(this.departmentId)
      .pipe(first())
      .subscribe({
        next: (department) => {
          if (!department || !department.id) {
            this.router.navigate(['admin', 'dashboard']);
            return;
          }

          this.department = department;

          this.requirementService
            .getRequirementsByDepartment(department.id)
            .pipe(first())
            .subscribe({
              next: (requirements) => {
                this.requirements = requirements;
              }
            });
        }
      });
  }

  clickCreateRequirementButton() {
    this.requirementForm.controls.name.setValue(null);
    this.requirementForm.controls.description.setValue(null);

    this.showCreatePanel = true;
  }

  createRequirement() {
    const requirementData: Requirement = {
      name: this.requirementForm.value.name ? this.requirementForm.value.name : undefined,
      description: this.requirementForm.value.description ? this.requirementForm.value.description : undefined,
      created_by_id: this.admin?.id
    };

    this.requirementService
      .createRequirement(requirementData)
      .pipe(first())
      .subscribe((requirement) => {
        alert('Successfully created requirement!');
        this.showCreatePanel = false;
        this.fetchRequirements();
      });
  }

  editRequirement(requirement: Requirement) {
    this.selectedRequirement = requirement;

    this.requirementForm.controls.name.setValue(this.selectedRequirement.name ? this.selectedRequirement.name : null);
    this.requirementForm.controls.description.setValue(this.selectedRequirement.description ? this.selectedRequirement.description : null);
  }

  updateRequirement() {
    if (!this.selectedRequirement || !this.selectedRequirement.id) {
      return;
    }

    const requirementData: Requirement = {
      name: this.requirementForm.value.name ? this.requirementForm.value.name : undefined,
      description: this.requirementForm.value.description ? this.requirementForm.value.description : undefined
    };

    this.requirementService
      .updateRequirement(this.selectedRequirement.id, requirementData)
      .pipe(first())
      .subscribe(() => {
        alert('Successfully updated!');

        this.selectedRequirement = undefined;
        this.fetchRequirements();
      });
  }

  deleteRequirement(requirement: Requirement) {
    if (!requirement.id) {
      return;
    }

    this.requirementService
      .deleteRequirement(requirement.id)
      .pipe(first())
      .subscribe(() => {
        alert('Successfully deleted!');
        this.fetchRequirements();
      });
  }
}
