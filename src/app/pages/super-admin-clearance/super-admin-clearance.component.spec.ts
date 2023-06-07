import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminClearanceComponent } from './super-admin-clearance.component';

describe('SuperAdminClearanceComponent', () => {
  let component: SuperAdminClearanceComponent;
  let fixture: ComponentFixture<SuperAdminClearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminClearanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
