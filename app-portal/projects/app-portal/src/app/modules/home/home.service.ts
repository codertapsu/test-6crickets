import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DeadlineService } from '@core';

@Injectable()
export class HomeService {
  private readonly _deadlineService = inject(DeadlineService);

  public loadDeadlineSeconds(): Observable<number> {
    return this._deadlineService.loadDeadline().pipe(map(deadline => deadline.secondsLeft));
  }
}
