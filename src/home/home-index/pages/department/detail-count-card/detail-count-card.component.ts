import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { coreSignal } from "@jot143/core-angular";
import { debounceTime, takeUntil } from "rxjs";
import { BaseComponent } from "../../../../../app/common/base.component";

@Component({
  selector: "app-detail-count-card",
  imports: [CommonModule],
  templateUrl: "./detail-count-card.component.html",
  styleUrl: "./detail-count-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailCountCardComponent extends BaseComponent implements OnInit {
  @Input() count = coreSignal<number>(0);
  @Input() title: string = "";
  @Input() iconSrc: string = "";
  @Input() iconAlt: string = "";
  @Input() site: string = "";
  @Input() terminal: string = ""; // Keep for backward compatibility
  @ViewChild("countElement", { static: false }) countElement!: ElementRef;

  ngOnInit() {
    this.count.subject.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.animateCountUp();
    });
  }

  animateCountUp() {
    let start = 0;
    const duration = 1000; // Animation time in ms
    const steps = 30; // Number of animation steps
    const increment = this.count() / steps;
    const intervalTime = duration / steps;

    const interval = setInterval(() => {
      start += increment;
      if (this.countElement) {
        this.countElement.nativeElement.textContent = Math.floor(start);
      }
      if (start >= this.count()) {
        clearInterval(interval);
        this.countElement.nativeElement.textContent = this.count(); // Ensure exact final count
      }
    }, intervalTime);
  }
}
