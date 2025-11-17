/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-auto-timer",
  imports: [CommonModule],
  template: `
    <div class="auto-timer-card bordered-rounded-card p-3">
      <h5 *ngIf="!timerEnded">Time Remaining: {{ countdown.minutes }} Mins. {{ countdown.seconds }} Sec.</h5>
      <h5 *ngIf="timerEnded">Time's up!</h5>
    </div>
  `,
  styles: [
    `
      .auto-timer-card {
        border: 1px solid var(--light-grey-border);
        border-radius: 0.5rem;
      }

      .auto-timer-card h5 {
        color: var(--black);
        font-size: var(--primary-font-size);
        font-weight: var(--font-medium);
        margin: 0;
      }
    `,
  ],
})
export class AutoTimerComponent implements OnInit, OnDestroy {
  countdown = {
    minutes: "30",
    seconds: "00",
  };
  timerEnded = false;
  private intervalId: any;
  private totalSeconds = 30 * 60; // 30 minutes in seconds

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startCountdown(): void {
    this.intervalId = setInterval(() => {
      if (this.totalSeconds <= 0) {
        this.timerEnded = true;
        this.countdown = { minutes: "00", seconds: "00" };
        clearInterval(this.intervalId);
      } else {
        this.timerEnded = false;
        const minutes = Math.floor(this.totalSeconds / 60);
        const seconds = this.totalSeconds % 60;

        this.countdown = {
          minutes: this.padZero(minutes),
          seconds: this.padZero(seconds),
        };
        this.totalSeconds--;
      }
    }, 1000);
  }

  padZero(value: number): string {
    return value < 10 ? "0" + value : value.toString();
  }
}
