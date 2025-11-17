import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { coreSignal, PageComponent, RequestLoader } from "@jot143/core-angular";
import { CommonModule } from "@angular/common";
import { DashboardService } from "../../../../app/services/dashboard.service";
import { DetailCountCardComponent } from "./detail-count-card/detail-count-card.component";
import { OverallAttendanceComponent } from "./overall-attendance/overall-attendance.component";
import { FlightStatusChartComponent } from "./flight-status-chart/flight-status-chart.component";

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DetailCountCardComponent, OverallAttendanceComponent, FlightStatusChartComponent],
})
export class DepartmentComponent extends PageComponent implements OnInit {
  override title = "Dashboard";

  private dashboardService = inject(DashboardService);

  // KPI Cards
  cards = [
    { count: coreSignal(1250), title: "Total Workers", site: "Site A", iconSrc: "/images/airport-icons/total-passenger.svg", iconAlt: "Total workers" },
    { count: coreSignal(45), title: "Site Staff", site: "Site A", iconSrc: "/images/airport-icons/support-staff.svg", iconAlt: "Site staff" },
    { count: coreSignal(28), title: "Safety & Security", site: "Site A", iconSrc: "/images/airport-icons/safety-security.svg", iconAlt: "Safety and security" },
    { count: coreSignal(12), title: "Active Projects", site: "Site A", iconSrc: "/images/airport-icons/last-call-passenger.svg", iconAlt: "Active projects" },
    { count: coreSignal(2), title: "Pending Tasks", site: "Site A", iconSrc: "/images/airport-icons/missed-passenger.svg", iconAlt: "Pending tasks" },
  ];
  private cdr = inject(ChangeDetectorRef);

  monthSelect = [
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
  ];

  isSearchVisible = true;

  countLoader = new RequestLoader();

  ngOnInit() {
    this.dashboardService.getDashboardMetrics(this.countLoader);
  }
}
