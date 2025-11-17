/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from "@angular/core";
import { Subscription } from "rxjs";
import { PlainMapTrackerComponent } from "./plain-map-tracker/plain-map-tracker.component";
import { MapRealViewComponent } from "./map-real-view/map-real-view.component";
import { MapTrackingService } from "./map-tracking.service";

@Component({
  selector: "app-map-tracking",
  imports: [CommonModule, PlainMapTrackerComponent, MapRealViewComponent],
  templateUrl: "./map-tracking.component.html",
  styleUrl: "./map-tracking.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapTrackingComponent implements OnDestroy {
  @ViewChildren("tabButtons") tabButtons!: QueryList<ElementRef>;
  activeTabIndex = 0;
  tabs = [
    {
      label: "Plain Map Tracker",
      icon: `<i class="bi bi-aspect-ratio"></i>`,
    },
    {
      label: "Real Time View",
      icon: `<i class="bi bi-box"></i>`,
    },
  ];

  private tabInterval: ReturnType<typeof setInterval> | undefined;
  private tabSwitchSubscription?: Subscription;

  constructor(
    private elementRef: ElementRef,
    private mapTrackingService: MapTrackingService
  ) {
    // Subscribe to tab switch events from child components
    this.tabSwitchSubscription = this.mapTrackingService.switchToTab$.subscribe(tabIndex => {
      this.setActiveTab(tabIndex);
    });
  }

  ngAfterViewInit() {
    // Set initial position of bg-active-slide
    setTimeout(() => this.moveSliderToTab(this.activeTabIndex), 0);
  }

  ngOnDestroy(): void {
    // Clean up the interval when component is destroyed
    if (this.tabInterval) {
      clearInterval(this.tabInterval);
    }
    // Clean up subscription
    if (this.tabSwitchSubscription) {
      this.tabSwitchSubscription.unsubscribe();
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
