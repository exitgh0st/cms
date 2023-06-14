import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPicModalComponent } from './preview-pic-modal.component';

describe('PreviewPicModalComponent', () => {
  let component: PreviewPicModalComponent;
  let fixture: ComponentFixture<PreviewPicModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewPicModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewPicModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
