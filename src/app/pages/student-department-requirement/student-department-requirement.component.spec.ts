import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDepartmentRequirementComponent } from './student-department-requirement.component';

describe('StudentDepartmentRequirementComponent', () => {
  let component: StudentDepartmentRequirementComponent;
  let fixture: ComponentFixture<StudentDepartmentRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentDepartmentRequirementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDepartmentRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
