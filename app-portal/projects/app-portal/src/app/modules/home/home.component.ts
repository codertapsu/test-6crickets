import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { shareReplay } from 'rxjs';

import { CountdownTimerComponent, TinyCountdownComponent } from '@ui';

import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, CountdownTimerComponent, TinyCountdownComponent],
  providers: [HomeService],
})
export class HomeComponent {
  private readonly _homeService = inject(HomeService);

  public readonly secondsLeft$ = this._homeService.loadDeadlineSeconds().pipe(shareReplay(1));
}
