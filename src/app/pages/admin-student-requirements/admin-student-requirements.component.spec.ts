import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStudentRequirementsComponent } from './admin-student-requirements.component';

describe('AdminStudentRequirementsComponent', () => {
  let component: AdminStudentRequirementsComponent;
  let fixture: ComponentFixture<AdminStudentRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminStudentRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStudentRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
