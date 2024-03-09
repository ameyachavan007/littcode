import { TestBed } from '@angular/core/testing';

import { AddQuestionService } from './add-question.service';

describe('AddQuestionService', () => {
  let service: AddQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
