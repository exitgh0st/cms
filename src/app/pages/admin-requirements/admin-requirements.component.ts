import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/models/department';
import { DepartmentService } from 'src/app/services/department.service';
import { first } from 'rxjs';
import { Requirement } from 'src/app/models/requirement';
import { RequirementService } from 'src/app/services/requirements.service';

@Component({
  selector: 'app-admin-requirements',
  templateUrl: './admin-requirements.component.html',
  styleUrls: ['./admin-requirements.component.scss']
})
export class AdminRequirementsComponent {
  department?: Department;
  requirements?: Requirement[];

  displayedTableColumns = ['id', 'created_by', 'name', 'description'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService,
    private requirementService: RequirementService
  ) {
    const departmentId = this.route.snapshot.paramMap.get('departmentId');
    if (!departmentId) {
      this.router.navigate(['admin', 'dashboard']);
      return;
    }

    this.departmentService
      .getDepartment(departmentId)
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
}
