/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { HealthStatsComponent } from "./health-stats/health-stats.component";
import { HealthObservationComponent } from "./health-observation/health-observation.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-health-tracking",
  imports: [HealthStatsComponent, HealthObservationComponent, CommonModule],
  templateUrl: "./health-tracking.component.html",
  styleUrl: "./health-tracking.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthTrackingComponent {
  @ViewChildren("tabButtons") tabButtons!: QueryList<ElementRef>;
  activeTabIndex = 0;
  tabs = [
    {
      label: "Health Stats",
      icon: `<i class="bi bi-activity"></i>`,
    },
    {
      label: "Health Observation",
      icon: `<i class="bi bi-clipboard2-pulse"></i>`,
    },
  ];

  constructor(private elementRef: ElementRef) {}

  private tabInterval: ReturnType<typeof setInterval> | undefined;

  ngAfterViewInit() {
    // Set initial position of bg-active-slide
    setTimeout(() => this.moveSliderToTab(this.activeTabIndex), 0);
  }

  ngOnDestroy(): void {
    // Clean up the interval when component is destroyed
    if (this.tabInterval) {
      clearInterval(this.tabInterval);
    }
  }

  // Tabs Switiching
  setActiveTab(index: number) {
    this.activeTabIndex = index;
    this.moveSliderToTab(index);
  }

  moveSliderToTab(index: number) {
    const tabButtons = this.tabButtons.toArray();
    if (tabButtons.length === 0) return;

    const activeTab = tabButtons[index].nativeElement;
    const slider = this.elementRef.nativeElement.querySelector(".bg-active-slide");
    const tabsList = this.elementRef.nativeElement.querySelector(".nav-pills-tabs-list");

    // Get the position of the tab relative to the tabs list
    const tabRect = activeTab.getBoundingClientRect();
    const tabsListRect = tabsList.getBoundingClientRect();

    // Calculate the left position (relative to the tabs list)
    const leftPosition = tabRect.left - tabsListRect.left;

    // Apply the transformation
    slider.style.width = `${tabRect.width}px`;
    slider.style.transform = `translateX(${leftPosition}px)`;
  }
}
