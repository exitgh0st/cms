import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminAdminsComponent } from './super-admin-admins.component';

describe('SuperAdminAdminsComponent', () => {
  let component: SuperAdminAdminsComponent;
  let fixture: ComponentFixture<SuperAdminAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminAdminsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
