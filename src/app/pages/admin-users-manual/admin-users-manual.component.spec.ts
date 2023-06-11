import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersManualComponent } from './admin-users-manual.component';

describe('AdminUsersManualComponent', () => {
  let component: AdminUsersManualComponent;
  let fixture: ComponentFixture<AdminUsersManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUsersManualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsersManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
