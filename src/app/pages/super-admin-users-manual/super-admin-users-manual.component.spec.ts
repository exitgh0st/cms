import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminUsersManualComponent } from './super-admin-users-manual.component';

describe('SuperAdminUsersManualComponent', () => {
  let component: SuperAdminUsersManualComponent;
  let fixture: ComponentFixture<SuperAdminUsersManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminUsersManualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminUsersManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
