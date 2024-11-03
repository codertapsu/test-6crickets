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
  selector: 'ui-tiny-countdown',
  templateUrl: './tiny-countdown.component.html',
  styleUrls: ['./tiny-countdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TinyCountdownComponent implements OnInit, OnDestroy, OnChanges {
  private readonly _window = inject(DOCUMENT).defaultView!;

  @ViewChild('canvas', { static: true })
  private _canvas!: ElementRef<HTMLCanvasElement>;
  private _context!: CanvasRenderingContext2D;
  private _intervalId: number | null = null;
  private _startTime = 0;

  @Input() public totalSeconds = 0;
  @Input() public size = 100;
  @Input() public strokeWidth = 2;
  @Output() public timerEnd = new EventEmitter<void>();

  public readonly $remainingSeconds = signal(0);

  public ngOnInit(): void {
    this.initializeTimer();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalSeconds'] || changes['remainingSeconds']) {
      this.resetTimer();
    }
  }

  public ngOnDestroy(): void {
    this.clearTimer();
  }

  private initializeTimer(): void {
    this._context = this._canvas.nativeElement.getContext('2d')!;
    this._startTime = this._window.performance.now();
    this.$remainingSeconds.set(this.totalSeconds);

    this.clearTimer();
    this._intervalId = this._window.setInterval(() => this.updateTimer(), 100);
  }

  private resetTimer(): void {
    this.initializeTimer();
  }

  private clearTimer(): void {
    if (this._intervalId !== null) {
      this._window.clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private updateTimer(): void {
    const currentTime = this._window.performance.now();
    const elapsedTime = (currentTime - this._startTime) / 1000;
    const remainingTime = Math.max(this.totalSeconds - elapsedTime, 0);

    this.$remainingSeconds.set(Math.floor(remainingTime));

    if (remainingTime <= 0) {
      this.clearTimer();
      this.timerEnd.emit();
    } else {
      const secondsInCycle = remainingTime % this.totalSeconds;
      const progressRatio = secondsInCycle / this.totalSeconds;
      this.drawProgress(progressRatio, Math.floor(secondsInCycle));
    }
  }

  private drawProgress(progressRatio: number, currentSeconds: number): void {
    const radius = this.size / 2;
    const angle = -Math.PI / 2 + 2 * Math.PI * progressRatio;
    const color = this.getProgressColor();

    this._context.clearRect(0, 0, this._canvas.nativeElement.width, this._canvas.nativeElement.height);

    this._context.beginPath();
    this._context.arc(radius, radius, radius - this.strokeWidth / 2, -Math.PI / 2, angle, false);
    this._context.strokeStyle = color;
    this._context.lineWidth = this.strokeWidth;
    this._context.stroke();

    this._context.font = `${this.size * 0.3}px Arial`;
    this._context.fillStyle = '#FFFFFF';
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText(`${currentSeconds}`, radius, radius + this.strokeWidth / 2);
  }

  private getProgressColor(): string {
    const period = this.totalSeconds;
    if (this.$remainingSeconds() > (period * 2) / 3) {
      return '#4caf50';
    }
    if (this.$remainingSeconds() > period / 3) {
      return '#ff9800';
    }
    return '#f44336';
  }
}
