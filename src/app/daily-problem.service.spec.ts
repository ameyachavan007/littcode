import { TestBed } from '@angular/core/testing';

import { DailyProblemService } from './daily-problem.service';

describe('DailyProblemService', () => {
  let service: DailyProblemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyProblemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
