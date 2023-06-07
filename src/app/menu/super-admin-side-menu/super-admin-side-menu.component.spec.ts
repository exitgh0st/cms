import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminSideMenuComponent } from './super-admin-side-menu.component';

describe('SuperAdminSideMenuComponent', () => {
  let component: SuperAdminSideMenuComponent;
  let fixture: ComponentFixture<SuperAdminSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuperAdminSideMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
