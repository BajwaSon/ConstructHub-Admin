/* eslint-disable @angular-eslint/use-lifecycle-interface */

import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { AbsentTrackingComponent } from "./absent-tracking/absent-tracking.component";
import { LiveTrackingComponent } from "./live-tracking/live-tracking.component";

@Component({
  selector: "app-attendance-tracking",
  imports: [CommonModule, LiveTrackingComponent, AbsentTrackingComponent],
  templateUrl: "./attendance-tracking.component.html",
  styleUrl: "./attendance-tracking.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceTrackingComponent {
  isSearchVisible = false;

  @ViewChildren("tabButtons") tabButtons!: QueryList<ElementRef>;
  activeTabIndex = 0;
  tabs = [
    {
      label: "Live Tracking",
      icon: `<i class='bx bx-devices' ></i>`,
    },
    {
      label: "Last Call Tracking",
      icon: `<i class='bx bx-hive' ></i>`,
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
    if (!this.tabButtons) return;

    const tabButtons = this.tabButtons.toArray();
    if (tabButtons.length === 0) return;

    const activeTab = tabButtons[index].nativeElement;
    const slider = this.elementRef.nativeElement.querySelector(".bg-active-slide");
    const tabsList = this.elementRef.nativeElement.querySelector(".nav-pills-tabs-list");

    if (!activeTab || !slider || !tabsList) return;

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
