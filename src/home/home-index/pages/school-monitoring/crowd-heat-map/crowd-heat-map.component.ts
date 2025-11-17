import { AfterViewInit, ChangeDetectionStrategy, Component } from "@angular/core";

type DensityLevel = "low" | "medium" | "high" | "very-high";

// Define the structure of each heat map point
interface HeatMapPoint {
  x: number;
  y: number;
  density: DensityLevel;
}

@Component({
  selector: "app-crowd-heat-map",
  imports: [],
  templateUrl: "./crowd-heat-map.component.html",
  styleUrl: "./crowd-heat-map.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrowdHeatMapComponent implements AfterViewInit {
  // Heatmap data
  staticHeatMapData: HeatMapPoint[] = [
    { x: 85, y: 70, density: "high" },
    { x: 8, y: 28, density: "medium" },
    { x: 25, y: 85, density: "medium" },
    { x: 85, y: 20, density: "medium" },
    { x: 84, y: 47, density: "medium" },
    { x: 12, y: 45, density: "medium" },
    { x: 53, y: 40, density: "medium" },
    { x: 65, y: 72, density: "medium" },
    { x: 82, y: 78, density: "medium" },
    { x: 5, y: 28, density: "low" },
    { x: 10, y: 38, density: "low" },
    { x: 15, y: 50, density: "low" },
    { x: 17, y: 65, density: "low" },
    { x: 35, y: 95, density: "low" },
    { x: 25, y: 95, density: "low" },
    { x: 55, y: 70, density: "low" },
    { x: 50, y: 80, density: "low" },
    { x: 52, y: 20, density: "low" },
    { x: 52, y: 30, density: "low" },
    { x: 53, y: 60, density: "low" },
    { x: 90, y: 78, density: "low" },
    { x: 84, y: 38, density: "low" },
    { x: 70, y: 75, density: "low" },
    { x: 60, y: 73, density: "low" },
    { x: 25, y: 112, density: "very-high" },
    { x: 50, y: 70, density: "very-high" },
    { x: 40, y: 90, density: "very-high" },
    { x: 30, y: 98, density: "very-high" },
    { x: 45, y: 74, density: "very-high" },
    { x: 45, y: 83, density: "very-high" },
    { x: 40, y: 83, density: "very-high" },
    { x: 42, y: 81, density: "very-high" },
    { x: 47, y: 82, density: "very-high" },
    { x: 22, y: 90, density: "very-high" },
    { x: 94, y: 80, density: "very-high" },
    { x: 58, y: 85, density: "very-high" },
    { x: 33, y: 90, density: "very-high" },
    { x: 30, y: 90, density: "high" },
    { x: 65, y: 80, density: "very-high" },
    { x: 22, y: 105, density: "very-high" },
    { x: 28, y: 105, density: "very-high" },
    { x: 28, y: 90, density: "very-high" },
    { x: 88, y: 85, density: "very-high" },
    { x: 28, y: 82, density: "very-high" },
    { x: 32, y: 105, density: "high" },
    { x: 65, y: 85, density: "high" },
    { x: 70, y: 85, density: "high" },
    { x: 63, y: 87, density: "high" },
    { x: 67, y: 83, density: "high" },
    { x: 52, y: 85, density: "high" },
    { x: 22, y: 72, density: "high" },
    { x: 75, y: 72, density: "high" },
    { x: 76, y: 78, density: "low" },
    { x: 35, y: 80, density: "low" },
    { x: 22, y: 98, density: "low" },
    { x: 55, y: 80, density: "low" },
    { x: 82, y: 68, density: "low" },
    { x: 84, y: 60, density: "low" },
  ];

  // Define the sort order
  densityOrder: Record<DensityLevel, number> = {
    low: 1,
    medium: 2,
    high: 3,
    "very-high": 4,
  };

  ngAfterViewInit(): void {
    this.renderHeatMap();

    const timeDisplay = document.getElementById("timeDisplay");
    if (timeDisplay) {
      timeDisplay.textContent = "Static View";
    }
  }

  renderHeatMap(): void {
    const overlay = document.getElementById("heatMapOverlay");
    if (!overlay) return;

    overlay.innerHTML = "";

    const sortedData = [...this.staticHeatMapData].sort((a, b) => this.densityOrder[a.density] - this.densityOrder[b.density]);

    sortedData.forEach(point => {
      const heatPoint = document.createElement("div");
      heatPoint.className = `heat-point ${point.density}-density`;
      heatPoint.style.left = `${point.x}%`;
      heatPoint.style.top = `${point.y}%`;
      overlay.appendChild(heatPoint);
    });
  }
}
