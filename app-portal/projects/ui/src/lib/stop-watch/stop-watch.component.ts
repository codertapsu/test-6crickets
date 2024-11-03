import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'ui-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class StopWatchComponent implements OnInit, OnDestroy, OnChanges {
  private readonly _window = inject(DOCUMENT).defaultView!;

  private _intervalId: number | null = null;

  @Input() public hours = 0;
  @Input() public minutes = 0;
  @Input() public seconds = 0;
  @Output() public timerEnd = new EventEmitter<void>();

  public readonly $formattedTime = signal('00:00:00');

  public ngOnInit(): void {
    this.updateFormattedTime();
    this.startTimer();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['hours'] || changes['minutes'] || changes['seconds']) {
      this.resetTimer();
    }
  }

  public ngOnDestroy(): void {
    this.clearTimer();
  }

  private resetTimer(): void {
    this.updateFormattedTime();
    this.startTimer();
  }

  private clearTimer(): void {
    if (this._intervalId !== null) {
      this._window.clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private startTimer(): void {
    this.clearTimer();
    this._intervalId = this._window.setInterval(() => this.updateTimer(), 1000);
  }

  private updateTimer(): void {
    if (this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
      this.timerEnd.emit();
      this.clearTimer();
      return;
    }

    this.decrementTime();
    this.updateFormattedTime();
  }

  private decrementTime(): void {
    if (this.seconds > 0) {
      this.seconds--;
    } else if (this.minutes > 0) {
      this.minutes--;
      this.seconds = 59;
    } else if (this.hours > 0) {
      this.hours--;
      this.minutes = 59;
      this.seconds = 59;
    }
  }

  private updateFormattedTime(): void {
    this.$formattedTime.set(
      `${this.formatNumber(this.hours)}:${this.formatNumber(this.minutes)}:${this.formatNumber(this.seconds)}`,
    );
  }

  private formatNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
