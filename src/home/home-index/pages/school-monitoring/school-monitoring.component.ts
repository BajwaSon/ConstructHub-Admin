import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from "@angular/core";
import { ClimateWidgetComponent } from "./climate-widget/climate-widget.component";
import { CrowdHeatMapComponent } from "./crowd-heat-map/crowd-heat-map.component";

@Component({
  selector: "app-school-monitoring",
  imports: [CommonModule, ClimateWidgetComponent, CrowdHeatMapComponent],
  templateUrl: "./school-monitoring.component.html",
  styleUrl: "./school-monitoring.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolMonitoringComponent implements AfterViewInit, OnDestroy {
  isSearchVisible = false;
  @ViewChildren("tabButtons") tabButtons!: QueryList<ElementRef>;

  activeTabIndex = 0;

  tabs = [
    // {
    //   label: "Gateway",
    //   icon: `<i class='bx bx-devices' ></i>`,
    // },
    {
      label: "Crowd Management",
      icon: `<i class='bx bx-hive' ></i>`,
    },
    {
      label: "Climate",
      icon: `<i class='bx bx-pie-chart'></i>`,
    },
  ];

  private tabInterval: ReturnType<typeof setInterval> | undefined;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // Set initial position of bg-active-slide
    setTimeout(() => this.moveSliderToTab(this.activeTabIndex), 0);

    // Start automatic tab switching
    this.startTabSwitching();
  }

  ngOnDestroy() {
    // Clean up the interval when component is destroyed
    if (this.tabInterval) {
      clearInterval(this.tabInterval);
    }
  }

  private startTabSwitching() {
    this.tabInterval = setInterval(() => {
      const nextIndex = (this.activeTabIndex + 1) % this.tabs.length;
      this.setActiveTab(nextIndex);
      document.getElementById(`pills-tab-${nextIndex}`)?.click();
    }, 30000); // 30 seconds interval
  }

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
