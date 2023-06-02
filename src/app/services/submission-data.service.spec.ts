import { TestBed } from '@angular/core/testing';

import { SubmissionDataService } from './submission-data.service';

describe('SubmissionDataService', () => {
  let service: SubmissionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
