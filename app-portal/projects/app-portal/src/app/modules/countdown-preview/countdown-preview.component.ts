import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { CountdownTimerComponent, StopWatchComponent, TinyCountdownComponent } from '@ui';

@Component({
  selector: 'app-countdown-preview',
  templateUrl: './countdown-preview.component.html',
  styleUrl: './countdown-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    CountdownTimerComponent,
    TinyCountdownComponent,
    StopWatchComponent,
  ],
})
export class CountdownPreviewComponent {
  private readonly _window = inject(DOCUMENT).defaultView!;

  public readonly $timerType = signal<'countdown' | 'stopwatch' | 'tiny'>('countdown');

  public readonly timerForm = new FormGroup(
    {
      minutes: new FormControl(0, [Validators.required, Validators.min(0)]),
      seconds: new FormControl(45, [Validators.required, Validators.min(1)]),
      size: new FormControl(200, [Validators.required, Validators.min(1)]),
      runnerSize: new FormControl(20, [Validators.required, Validators.min(1)]),
      strokeWidth: new FormControl(10, [Validators.required, Validators.min(1)]),
      durationOfFullCycle: new FormControl(60, [Validators.required, Validators.min(1)]),
    },
    {
      updateOn: 'submit',
    },
  );

  public onTimerEnd(): void {
    this._window.alert(`Timer ended with ${this.$timerType()}`);
  }
}
