import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Deadline } from '../models/deadline.model';

@Injectable({
  providedIn: 'root',
})
export class DeadlineService {
  private readonly _apiEndpoint = 'http://localhost:3000/api';
  private readonly _httpClient = inject(HttpClient);

  public loadDeadline(): Observable<Deadline> {
    return this._httpClient.get<Deadline>(`${this._apiEndpoint}/deadline`);
  }
}
