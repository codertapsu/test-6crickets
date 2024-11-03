import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'ui-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CountdownTimerComponent implements OnInit, OnDestroy, OnChanges {
  private readonly _window = inject(DOCUMENT).defaultView!;

  @ViewChild('canvas', { static: true })
  private _canvas!: ElementRef<HTMLCanvasElement>;
  private _context!: CanvasRenderingContext2D;
  private _totalSeconds = 0;
  private _startTime = 0;
  private _intervalId!: number | null;
  private _remainingSeconds = 0;

  public readonly $remainingMinutes = signal<number>(0);

  @Input() public minutes = 0;
  @Input() public seconds = 0;
  @Input() public durationOfFullCycle = 60;
  @Input() public size = 200;
  @Input() public runnerSize = 20;
  @Input() public strokeWidth = 10;
  @Output() public timerEnd = new EventEmitter<void>();

  public ngOnInit(): void {
    this.initializeTimer();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['minutes'] ||
      changes['seconds'] ||
      changes['durationOfFullCycle'] ||
      changes['size'] ||
      changes['runnerSize'] ||
      changes['strokeWidth']
    ) {
      this.resetTimer();
    }
  }

  public ngOnDestroy(): void {
    this.clearTimer();
  }

  private initializeTimer(): void {
    this._context = this._canvas.nativeElement.getContext('2d')!;
    this._totalSeconds = this.minutes * this.durationOfFullCycle + this.seconds;
    this._remainingSeconds = this._totalSeconds;
    this.$remainingMinutes.set(Math.floor(this._totalSeconds / this.durationOfFullCycle));
    this._startTime = this._window.performance.now();

    this.clearTimer();
    this._intervalId = this._window.setInterval(() => this.animateProgress(), 100);
  }

  private resetTimer(): void {
    this.initializeTimer();
  }

  private clearTimer(): void {
    if (this._intervalId) {
      this._window.clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private animateProgress(): void {
    const currentTime = this._window.performance.now();
    const elapsedTime = (currentTime - this._startTime) / 1000;
    const remainingTime = Math.max(this._totalSeconds - elapsedTime, 0);

    this._remainingSeconds = Math.floor(remainingTime);
    this.$remainingMinutes.set(Math.floor(this._remainingSeconds / this.durationOfFullCycle));

    if (remainingTime <= 0) {
      this.clearTimer();
      this.timerEnd.emit();
      return;
    }

    const secondsInCycle = remainingTime % this.durationOfFullCycle;
    const progressRatio = secondsInCycle / this.durationOfFullCycle;
    this.drawProgress(progressRatio, Math.floor(secondsInCycle));
  }

  private drawProgress(progressRatio: number, currentSeconds: number): void {
    const radius = this.size / 2 - this.strokeWidth;

    this._context.clearRect(0, 0, this._canvas.nativeElement.width, this._canvas.nativeElement.height);

    const centerOffset = this.runnerSize;
    const centerX = this.size / 2 + centerOffset;
    const centerY = this.size / 2 + centerOffset;

    this._context.beginPath();
    this._context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this._context.lineWidth = this.strokeWidth;
    this._context.strokeStyle = '#E0E0E0';
    this._context.stroke();

    this._context.beginPath();
    this._context.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * progressRatio);
    this._context.lineWidth = this.strokeWidth;
    this._context.strokeStyle = '#2196F3';
    this._context.stroke();

    const angle = -Math.PI / 2 + 2 * Math.PI * progressRatio;
    const runnerX = centerX + radius * Math.cos(angle);
    const runnerY = centerY + radius * Math.sin(angle);

    this._context.beginPath();
    this._context.arc(runnerX, runnerY, this.runnerSize, 0, 2 * Math.PI);
    this._context.fillStyle = '#FFFFFF';
    this._context.fill();

    this._context.fillStyle = '#000000';
    this._context.font = `${this.runnerSize * 0.6}px Arial`;
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText(currentSeconds.toString().padStart(2, '0'), runnerX, runnerY);
  }
}
