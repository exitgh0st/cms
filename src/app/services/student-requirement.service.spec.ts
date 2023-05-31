import { TestBed } from '@angular/core/testing';

import { StudentRequirementService } from './student-requirement.service';

describe('StudentRequirementService', () => {
  let service: StudentRequirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
