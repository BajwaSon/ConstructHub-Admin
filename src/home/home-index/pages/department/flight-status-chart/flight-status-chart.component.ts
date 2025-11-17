/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from "@angular/core";
import { NgApexchartsModule } from "ng-apexcharts";
import { CommonModule } from "@angular/common";
import { SelectDropdownComponent } from "../../../../components/select-dropdown/select-dropdown.component";
import { monthOptions } from "../../../../../app/common/options/months";

@Component({
  selector: "app-flight-status-chart",
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, SelectDropdownComponent],
  template: `
    <div class="flight-status-chart-container bordered-rounded-card">
      <div class="chart-header">
        <h4>Worker Status Overall</h4>
        <div class="overall-stats-filter-select flex-center-align gap-2">
          @if (showMonthSelect) {
            <div class="stats-select-dropdown">
              <app-select-dropdown [options]="monthOptions" [selectedValue]="selectedMonthValue" (selectedValueChange)="onMonthChange($event)"></app-select-dropdown>
            </div>
          }
          <div class="stats-select-dropdown">
            <app-select-dropdown [options]="timeRange" (selectedValueChange)="onTimeRangeChange($event)"></app-select-dropdown>
          </div>
        </div>
      </div>

      <div class="chart-row">
        <div class="chart-column">
          <h5>Worker Status by Day</h5>
          <apx-chart
            [series]="hourlyChartOptions.series"
            [chart]="hourlyChartOptions.chart"
            [xaxis]="hourlyChartOptions.xaxis"
            [yaxis]="hourlyChartOptions.yaxis"
            [dataLabels]="hourlyChartOptions.dataLabels"
            [grid]="hourlyChartOptions.grid"
            [stroke]="hourlyChartOptions.stroke"
            [tooltip]="hourlyChartOptions.tooltip"
            [legend]="hourlyChartOptions.legend"
            [fill]="hourlyChartOptions.fill">
          </apx-chart>
        </div>

        <div class="chart-column">
          <h5>Worker Status Distribution</h5>
          <apx-chart
            [series]="pieChartOptions.series"
            [chart]="pieChartOptions.chart"
            [labels]="pieChartOptions.labels"
            [plotOptions]="pieChartOptions.plotOptions"
            [dataLabels]="pieChartOptions.dataLabels"
            [legend]="pieChartOptions.legend"
            [tooltip]="pieChartOptions.tooltip"
            [fill]="pieChartOptions.fill">
          </apx-chart>
        </div>
      </div>

      <div class="chart-row">
        <div class="chart-column full-width">
          <h5>Daily Worker Trends</h5>
          <apx-chart
            [series]="dailyChartOptions.series"
            [chart]="dailyChartOptions.chart"
            [xaxis]="dailyChartOptions.xaxis"
            [yaxis]="dailyChartOptions.yaxis"
            [dataLabels]="dailyChartOptions.dataLabels"
            [grid]="dailyChartOptions.grid"
            [stroke]="dailyChartOptions.stroke"
            [tooltip]="dailyChartOptions.tooltip"
            [legend]="dailyChartOptions.legend"
            [fill]="dailyChartOptions.fill"
            [markers]="dailyChartOptions.markers">
          </apx-chart>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./flight-status-chart.component.scss"],
})
export class FlightStatusChartComponent {
  @ViewChild("chart") chart: any;

  public hourlyChartOptions: any = {};
  public pieChartOptions: any = {};
  public dailyChartOptions: any = {};

  // Filters
  monthOptions = monthOptions;
  timeRange = [
    { label: "Monthly", value: "Monthly" },
    { label: "Daily", value: "Daily" },
  ];
  showMonthSelect = false;
  selectedMonthValue = String(new Date().getMonth() + 1).padStart(2, "0");

  constructor() {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    // Get base data
    const presentData = this.showMonthSelect
      ? this.adjustToLength([92, 93, 94, 91, 93, 95, 96, 94, 95, 96, 97, 98, 95, 96, 97, 98, 99, 97, 98, 99, 96, 97, 98, 99, 95, 96, 97, 98, 99, 97], this.getDaysInSelectedMonth())
      : [92, 94, 95, 93, 96, 97, 98, 95, 96, 97, 98, 99];

    const absentData = this.showMonthSelect
      ? this.adjustToLength([4, 3, 3, 5, 4, 3, 2, 4, 3, 2, 2, 1, 3, 2, 2, 1, 1, 2, 1, 1, 3, 2, 1, 1, 3, 2, 2, 1, 1, 2], this.getDaysInSelectedMonth())
      : [4, 3, 3, 4, 2, 2, 1, 3, 2, 2, 1, 1];

    const onLeaveData = this.showMonthSelect
      ? this.adjustToLength([4, 4, 3, 4, 3, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 2, 2, 1, 1, 0, 1], this.getDaysInSelectedMonth())
      : [4, 3, 2, 3, 2, 1, 1, 2, 2, 1, 1, 0];

    // Ensure data adds up to 100% for each data point
    const adjustedData = this.ensureStackedBarDataAddsTo100(presentData, absentData, onLeaveData);

    // Worker Status by Day (Stacked Bar)
    this.hourlyChartOptions = {
      series: [
        {
          name: "Present",
          data: adjustedData.boarding,
        },
        {
          name: "Absent",
          data: adjustedData.missed,
        },
        {
          name: "On Leave",
          data: adjustedData.delayed,
        },
      ],
      chart: {
        type: "bar",
        height: 300,
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        background: "transparent",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 600,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 3,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "12px",
        fontFamily: "'Host Grotesk', serif",
        markers: {
          width: 12,
          height: 12,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      xaxis: {
        categories: this.showMonthSelect ? this.getDailyCategoriesForSelectedMonth() : this.getMonthlyCategories(),
        labels: {
          style: {
            colors: "#666",
            fontSize: "11px",
            fontFamily: "'Host Grotesk', serif",
          },
          rotate: 0,
          rotateAlways: false,
        },
        axisBorder: {
          color: "#e5e7eb",
        },
        axisTicks: {
          color: "#e5e7eb",
        },
      },
      yaxis: {
        title: {
          text: "Percentage (%)",
          style: {
            color: "#666",
            fontSize: "12px",
            fontFamily: "'Host Grotesk', serif",
          },
        },
        labels: {
          style: {
            colors: "#666",
            fontSize: "11px",
            fontFamily: "'Host Grotesk', serif",
          },
          formatter: (val: number) => `${val}%`,
        },
        grid: {
          color: "#e5e7eb",
          opacity: 0.5,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: "light",
        style: {
          fontFamily: "'Host Grotesk', serif",
          fontSize: "12px",
        },
        x: {
          formatter: (val: any, opts: any) => this.formatTooltipDate(val, opts),
        },
        y: {
          formatter: function (val: any) {
            return val + "%";
          },
        },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 5,
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.5,
        },
      },
      colors: ["#3B82F6", "#EF4444", "#F59E0B"],
    };

    // Pie Chart for Worker Status Distribution
    this.pieChartOptions = {
      series: [94, 3, 3],
      chart: {
        type: "donut",
        height: 300,
        background: "transparent",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      labels: ["Present", "Absent", "On Leave"],
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            background: "transparent",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "16px",
                fontFamily: "'Host Grotesk', serif",
                fontWeight: 600,
                color: "#111827",
              },
              value: {
                show: true,
                fontSize: "14px",
                fontFamily: "'Host Grotesk', serif",
                fontWeight: 400,
                color: "#666",
                formatter: function (val: any) {
                  return val + "%";
                },
              },
              total: {
                show: true,
                label: "Total Workers",
                fontSize: "16px",
                fontFamily: "'Host Grotesk', serif",
                fontWeight: 600,
                color: "#111827",
                formatter: function (w: any) {
                  return w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontSize: "12px",
        fontFamily: "'Host Grotesk', serif",
        markers: {
          width: 12,
          height: 12,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      tooltip: {
        theme: "light",
        style: {
          fontFamily: "'Host Grotesk', serif",
          fontSize: "12px",
        },
        y: {
          formatter: function (val: any) {
            return val + "% of workers";
          },
        },
      },
      fill: {
        colors: ["#3B82F6", "#EF4444", "#F59E0B"],
      },
      stroke: {
        colors: ["#ffffff"],
        width: 2,
      },
    };

    // Daily Worker Trends Chart
    this.dailyChartOptions = {
      series: this.showMonthSelect
        ? [
            {
              name: "Present",
              data: this.adjustToLength(
                [92, 94, 95, 93, 96, 97, 98, 95, 96, 97, 98, 99, 95, 96, 97, 98, 99, 97, 98, 99, 96, 97, 98, 99, 95, 96, 97, 98, 99, 97],
                this.getDaysInSelectedMonth()
              ).map((value, index) => {
                const onLeaveValue = this.adjustToLength([4, 4, 3, 4, 3, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 2, 2, 1, 1, 0, 1], this.getDaysInSelectedMonth())[
                  index
                ];
                return this.calculatePercentage(value, onLeaveValue, false);
              }),
            },
            {
              name: "On Leave",
              data: this.adjustToLength([4, 4, 3, 4, 3, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 2, 2, 1, 1, 0, 1], this.getDaysInSelectedMonth()).map(
                (value, index) => {
                  const presentValue = this.adjustToLength(
                    [92, 94, 95, 93, 96, 97, 98, 95, 96, 97, 98, 99, 95, 96, 97, 98, 99, 97, 98, 99, 96, 97, 98, 99, 95, 96, 97, 98, 99, 97],
                    this.getDaysInSelectedMonth()
                  )[index];
                  return this.calculatePercentage(presentValue, value, true);
                }
              ),
            },
          ]
        : [
            {
              name: "Present",
              data: [94, 96, 97, 95, 98, 99, 98, 95, 96, 97, 98, 99].map((value, index) => {
                const onLeaveValue = [3, 2, 2, 3, 1, 1, 1, 3, 2, 2, 1, 1][index];
                return this.calculatePercentage(value, onLeaveValue, false);
              }),
            },
            {
              name: "On Leave",
              data: [3, 2, 2, 3, 1, 1, 1, 3, 2, 2, 1, 1].map((value, index) => {
                const presentValue = [94, 96, 97, 95, 98, 99, 98, 95, 96, 97, 98, 99][index];
                return this.calculatePercentage(presentValue, value, true);
              }),
            },
          ],
      chart: {
        type: "area",
        height: 300,
        background: "transparent",
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.3,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      markers: {
        size: 5,
        colors: ["#3B82F6", "#F59E0B"],
        strokeColors: "#ffffff",
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },
      xaxis: {
        categories: this.hourlyChartOptions.xaxis.categories,
        labels: {
          style: {
            colors: "#666",
            fontSize: "11px",
            fontFamily: "'Host Grotesk', serif",
          },
          rotate: 0,
          rotateAlways: false,
        },
        axisBorder: {
          color: "#e5e7eb",
        },
        axisTicks: {
          color: "#e5e7eb",
        },
      },
      yaxis: {
        title: {
          text: "Percentage (%)",
          style: {
            color: "#666",
            fontSize: "12px",
            fontFamily: "'Host Grotesk', serif",
          },
        },
        labels: {
          style: {
            colors: "#666",
            fontSize: "11px",
            fontFamily: "'Host Grotesk', serif",
          },
          formatter: (val: number) => `${val}%`,
        },
        grid: {
          color: "#e5e7eb",
          opacity: 0.5,
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: "light",
        style: {
          fontFamily: "'Host Grotesk', serif",
          fontSize: "12px",
        },
        y: {
          formatter: function (val: any) {
            return val + "%";
          },
        },
        x: {
          formatter: (val: any, opts: any) => (this.showMonthSelect ? this.formatTooltipDate(val, opts) : "" + val),
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        fontSize: "12px",
        fontFamily: "'Host Grotesk', serif",
        markers: {
          width: 12,
          height: 12,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      grid: {
        borderColor: "#e5e7eb",
        strokeDashArray: 5,
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.5,
        },
      },
      colors: ["#3B82F6", "#F59E0B"],
    };
  }

  onMonthChange(selectedMonth: any) {
    this.selectedMonthValue = selectedMonth?.value ?? this.selectedMonthValue;
    // For now we keep static data; if wired to API, use selectedMonthValue
    this.showMonthSelect = true; // ensure daily (days of selected month)
    this.initializeCharts();
  }

  onTimeRangeChange(selectedRange: any) {
    this.showMonthSelect = selectedRange?.value === "Daily";
    this.initializeCharts();
  }

  private formatTooltipDate(_val: any, opts: any): string {
    try {
      const currentYear = new Date().getFullYear();
      if (this.showMonthSelect) {
        // Daily view: categories are '1'..'30'
        const dayStr = this.hourlyChartOptions?.xaxis?.categories?.[opts?.dataPointIndex] || "1";
        const day = Number(dayStr);
        const monthIndex = Number(this.selectedMonthValue) - 1; // 0-based
        const date = new Date(currentYear, isNaN(monthIndex) ? 0 : monthIndex, isNaN(day) ? 1 : day);
        return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
      }
      // Monthly view: categories are month short names
      const monthIndex = opts?.dataPointIndex ?? 0;
      const date = new Date(currentYear, monthIndex, 1);
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return "" + _val;
    }
  }

  private getDaysInSelectedMonth(): number {
    const currentYear = new Date().getFullYear();
    const monthIndex = Number(this.selectedMonthValue) - 1;
    return new Date(currentYear, isNaN(monthIndex) ? 1 : monthIndex + 1, 0).getDate();
  }

  private getDailyCategoriesForSelectedMonth(includeMonthName: boolean = false): string[] {
    const currentYear = new Date().getFullYear();
    const monthIndex = Number(this.selectedMonthValue) - 1;
    const days = this.getDaysInSelectedMonth();
    const monthShort = new Date(currentYear, monthIndex, 1).toLocaleDateString("en-US", { month: "short" });
    return Array.from({ length: days }, (_, i) => (includeMonthName ? `${i + 1} ${monthShort}` : `${i + 1} ${monthShort}`));
  }

  private getMonthlyCategories(includeYear: boolean = false): string[] {
    const currentYear = new Date().getFullYear();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return includeYear ? months.map(m => `${m} ${currentYear}`) : months;
  }

  private adjustToLength<T>(arr: T[], length: number): T[] {
    if (arr.length === length) return arr;
    if (arr.length > length) return arr.slice(0, length);
    const result = [...arr];
    while (result.length < length) {
      result.push(arr[result.length % arr.length]);
    }
    return result;
  }

  private ensureStackedBarDataAddsTo100(boardingData: number[], missedData: number[], delayedData: number[]): { boarding: number[]; missed: number[]; delayed: number[] } {
    const result = {
      boarding: [...boardingData],
      missed: [...missedData],
      delayed: [...delayedData],
    };

    for (let i = 0; i < result.boarding.length; i++) {
      const total = result.boarding[i] + result.missed[i] + result.delayed[i];
      if (total !== 100) {
        // Adjust to ensure total is 100%
        const adjustment = 100 - total;
        result.boarding[i] = Math.max(90, result.boarding[i] + adjustment);

        // Ensure present workers is at least 90%
        if (result.boarding[i] < 90) {
          const shortfall = 90 - result.boarding[i];
          result.boarding[i] = 90;
          result.missed[i] = Math.max(2, result.missed[i] - shortfall);
          result.delayed[i] = Math.max(2, result.delayed[i] - shortfall);
        }

        // Ensure absent and on leave are at least 2%
        result.missed[i] = Math.max(2, result.missed[i]);
        result.delayed[i] = Math.max(2, result.delayed[i]);

        // Recalculate to ensure total is exactly 100%
        const newTotal = result.boarding[i] + result.missed[i] + result.delayed[i];
        if (newTotal > 100) {
          const excess = newTotal - 100;
          result.boarding[i] = Math.max(90, result.boarding[i] - excess);
        }
      }
    }

    return result;
  }

  private calculatePercentage(value: number, onLeaveValue: number, isOnLeave: boolean = false): number {
    if (isOnLeave) {
      // For workers on leave, ensure it's small (2-5%)
      const onLeavePercentage = Math.min(Math.max(onLeaveValue, 2), 5);
      return onLeavePercentage;
    } else {
      // For present workers, calculate as 100% - on leave%
      const onLeavePercentage = Math.min(Math.max(onLeaveValue, 2), 5);
      return 100 - onLeavePercentage;
    }
  }
}
