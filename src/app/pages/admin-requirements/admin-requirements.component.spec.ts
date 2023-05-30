import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequirementsComponent } from './admin-requirements.component';

describe('AdminRequirementsComponent', () => {
  let component: AdminRequirementsComponent;
  let fixture: ComponentFixture<AdminRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
