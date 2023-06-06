import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminStudentsComponent } from './super-admin-students.component';

describe('SuperAdminStudentsComponent', () => {
  let component: SuperAdminStudentsComponent;
  let fixture: ComponentFixture<SuperAdminStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminStudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
