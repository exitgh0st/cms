import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErikaComponent } from './erika.component';

describe('ErikaComponent', () => {
  let component: ErikaComponent;
  let fixture: ComponentFixture<ErikaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErikaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
