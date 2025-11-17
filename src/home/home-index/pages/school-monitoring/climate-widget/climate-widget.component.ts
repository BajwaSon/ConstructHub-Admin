/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren, AfterViewInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-climate-widget",
  imports: [],
  templateUrl: "./climate-widget.component.html",
  styleUrl: "./climate-widget.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClimateWidgetComponent implements AfterViewInit, OnDestroy {
  @ViewChild("widgetContainer", { static: true }) widgetContainer!: ElementRef;
  @ViewChildren("temperatureValue", { read: ElementRef }) temperatureValues!: QueryList<ElementRef>;
  @ViewChildren("humidityValue", { read: ElementRef }) humidityValues!: QueryList<ElementRef>;
  @ViewChild("aqiValue", { static: true }) aqiValueEl!: ElementRef;
  @ViewChild("aqiStatus", { static: true }) aqiStatusEl!: ElementRef;
  @ViewChild("aqiGauge", { static: true }) aqiGaugeEl!: ElementRef;
  @ViewChild("aqiDescription", { static: true }) aqiDescEl!: ElementRef;
  @ViewChildren("timestamp", { read: ElementRef }) timestamps!: QueryList<ElementRef>;

  intervalId: any;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.intervalId = setInterval(() => this.updateSensorData(), 5000);
  }

  updateSensorData(): void {
    const insideTempEl = this.widgetContainer.nativeElement.querySelector(".temp-card-inside .temperature-value");
    const outsideTempEl = this.widgetContainer.nativeElement.querySelector(".temp-card-outside .temperature-value");
    const insideHumEl = this.widgetContainer.nativeElement.querySelector(".humidity-card-inside .humidity-value");
    const outsideHumEl = this.widgetContainer.nativeElement.querySelector(".humidity-card-outside .humidity-value");
    const aqiEl = this.widgetContainer.nativeElement.querySelector(".aqi-card .aqi-value");
    const aqiStatus = this.widgetContainer.nativeElement.querySelector(".aqi-status");
    const aqiGauge = this.widgetContainer.nativeElement.querySelector(".aqi-gauge");
    const aqiDescription = this.widgetContainer.nativeElement.querySelector(".aqi-description");
    const timestampEls = this.widgetContainer.nativeElement.querySelectorAll(".card-footer small");

    let inTemp = this.getNumeric(insideTempEl.textContent);
    let outTemp = this.getNumeric(outsideTempEl.textContent);
    let inHum = this.getNumeric(insideHumEl.textContent);
    let outHum = this.getNumeric(outsideHumEl.textContent);
    let aqi = this.getNumeric(aqiEl.textContent);

    inTemp += (Math.random() - 0.5) * 0.2;
    outTemp += (Math.random() - 0.5) * 0.5;
    inHum += (Math.random() - 0.5) * 0.5;
    outHum += (Math.random() - 0.5) * 1;
    aqi += (Math.random() - 0.5) * 2;

    insideTempEl.innerHTML = `${inTemp.toFixed(1)}<span class="unit">°C</span>`;
    outsideTempEl.innerHTML = `${outTemp.toFixed(1)}<span class="unit">°C</span>`;
    insideHumEl.innerHTML = `${Math.round(inHum)}<span class="unit">%</span>`;
    outsideHumEl.innerHTML = `${Math.round(outHum)}<span class="unit">%</span>`;
    aqiEl.innerHTML = `${Math.round(aqi)}<span class="aqi-unit">AQI</span>`;

    const aqiValue = Math.round(aqi);
    aqiStatus.classList.remove("status-good", "status-moderate", "status-sensitive", "status-unhealthy", "status-very-unhealthy");

    if (aqiValue <= 50) {
      this.setAQIStatus(
        aqiStatus,
        aqiGauge,
        aqiDescription,
        "Good",
        "status-good",
        "#2ecc71",
        "Air quality is considered satisfactory, and air pollution poses little or no risk."
      );
    } else if (aqiValue <= 100) {
      this.setAQIStatus(
        aqiStatus,
        aqiGauge,
        aqiDescription,
        "Moderate",
        "status-moderate",
        "#f1c40f",
        "Air quality is acceptable; however, there may be some concern for a small number of sensitive individuals."
      );
    } else if (aqiValue <= 150) {
      this.setAQIStatus(
        aqiStatus,
        aqiGauge,
        aqiDescription,
        "Unhealthy for Sensitive Groups",
        "status-sensitive",
        "#e67e22",
        "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
      );
    } else if (aqiValue <= 200) {
      this.setAQIStatus(
        aqiStatus,
        aqiGauge,
        aqiDescription,
        "Unhealthy",
        "status-unhealthy",
        "#e74c3c",
        "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects."
      );
    } else {
      this.setAQIStatus(
        aqiStatus,
        aqiGauge,
        aqiDescription,
        "Very Unhealthy",
        "status-very-unhealthy",
        "#9b59b6",
        "Health warnings of emergency conditions. The entire population is more likely to be affected."
      );
    }

    timestampEls.forEach((ts: any) => {
      ts.textContent = "Updated: Just now";
    });
  }

  getNumeric(value: string): number {
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  setAQIStatus(statusEl: HTMLElement, gaugeEl: HTMLElement, descEl: HTMLElement, label: string, statusClass: string, color: string, desc: string) {
    statusEl.textContent = label;
    this.renderer.addClass(statusEl, statusClass);
    this.renderer.setStyle(gaugeEl, "borderTopColor", color);
    this.renderer.setStyle(gaugeEl, "borderRightColor", color);
    descEl.textContent = desc;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
