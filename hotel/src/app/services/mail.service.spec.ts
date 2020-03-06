import {TestBed} from '@angular/core/testing';
import {Mail

.
ServiceService
}
from
'./mail.service.service';

describe('Mail.ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Mail.ServiceService = TestBed.get(Mail.ServiceService);
    expect(service).toBeTruthy();
  });
});
