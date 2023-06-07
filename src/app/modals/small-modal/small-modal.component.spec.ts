import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallModalComponent } from './small-modal.component';

describe('ConfirmDeleteModalComponent', () => {
  let component: SmallModalComponent;
  let fixture: ComponentFixture<SmallModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmallModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SmallModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
