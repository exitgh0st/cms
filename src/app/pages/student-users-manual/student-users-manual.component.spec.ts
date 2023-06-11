import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentUsersManualComponent } from './student-users-manual.component';

describe('StudentUsersManualComponent', () => {
  let component: StudentUsersManualComponent;
  let fixture: ComponentFixture<StudentUsersManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentUsersManualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentUsersManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
