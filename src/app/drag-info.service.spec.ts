import { TestBed, inject } from '@angular/core/testing';

import { DragInfoService } from './drag-info.service';

describe('DragInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DragInfoService]
    });
  });

  it('should be created', inject([DragInfoService], (service: DragInfoService) => {
    expect(service).toBeTruthy();
  }));
});
