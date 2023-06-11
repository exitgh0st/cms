import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminFaqComponent } from './super-admin-faq.component';

describe('SuperAdminFaqComponent', () => {
  let component: SuperAdminFaqComponent;
  let fixture: ComponentFixture<SuperAdminFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminFaqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
