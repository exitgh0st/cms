import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFaqComponent } from './student-faq.component';

describe('StudentFaqComponent', () => {
  let component: StudentFaqComponent;
  let fixture: ComponentFixture<StudentFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentFaqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
