/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { MapTrackingService } from "../map-tracking.service";

declare let google: any;

interface Site {
  name: string;
  lat: number;
  lng: number;
  workerCount: number;
}

interface Worker {
  id: string;
  name: string;
  type: string;
  role: "worker" | "supervisor" | "foreman";
  site: string;
  lat: number;
  lng: number;
}

@Component({
  selector: "app-map-real-view",
  imports: [],
  templateUrl: "./map-real-view.component.html",
  styleUrl: "./map-real-view.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRealViewComponent implements AfterViewInit, OnDestroy {
  map: any;
  siteMarkers: any[] = [];
  workerMarkers: any[] = [];
  infoWindow: any;

  // Base location: Dubai Silicon Oasis Metro Station
  private readonly BASE_LAT = 25.120201752843574;
  private readonly BASE_LNG = 55.38762432296308;

  // Sample sites with coordinates around Dubai Silicon Oasis
  sites: Site[] = [
    { name: "Site A", lat: 25.1202, lng: 55.3876, workerCount: 5 },
    { name: "Site B", lat: 25.125, lng: 55.39, workerCount: 3 },
    { name: "Site C", lat: 25.115, lng: 55.385, workerCount: 4 },
    { name: "Building A", lat: 25.118, lng: 55.389, workerCount: 2 },
    { name: "Building B", lat: 25.122, lng: 55.386, workerCount: 3 },
    { name: "Building C", lat: 25.116, lng: 55.388, workerCount: 2 },
  ];

  workers: Worker[] = [
    // Site A - Workers
    { id: "WRK-86234696", name: "Ahmed Hassan", type: "Carpenter", role: "worker", site: "Site A", lat: 25.1203, lng: 55.3877 },
    { id: "WRK-23984712", name: "Mohammed Ali", type: "Laborer", role: "worker", site: "Site A", lat: 25.1201, lng: 55.3875 },
    { id: "WRK-38475621", name: "Omar Ibrahim", type: "Electrician", role: "worker", site: "Site A", lat: 25.12, lng: 55.3874 },
    { id: "WRK-56372819", name: "Khalid Ahmed", type: "Plumber", role: "worker", site: "Site A", lat: 25.1205, lng: 55.3879 },
    // Site A - Supervisors
    { id: "WRK-98472635", name: "Sarah Johnson", type: "Supervisor", role: "supervisor", site: "Site A", lat: 25.1204, lng: 55.3878 },
    { id: "WRK-29384756", name: "David Wilson", type: "Supervisor", role: "supervisor", site: "Site A", lat: 25.1202, lng: 55.3876 },
    // Site A - Foremen
    { id: "WRK-84736291", name: "James Anderson", type: "Foreman", role: "foreman", site: "Site A", lat: 25.1206, lng: 55.388 },

    // Site B - Workers
    { id: "WRK-82736491", name: "Fatima Al-Zahra", type: "Welder", role: "worker", site: "Site B", lat: 25.1251, lng: 55.3901 },
    { id: "WRK-67584932", name: "Yusuf Khan", type: "Laborer", role: "worker", site: "Site B", lat: 25.1252, lng: 55.3902 },
    { id: "WRK-74839261", name: "Hassan Malik", type: "Mason", role: "worker", site: "Site B", lat: 25.1253, lng: 55.3903 },
    // Site B - Supervisors
    { id: "WRK-29384765", name: "Emma Wilson", type: "Supervisor", role: "supervisor", site: "Site B", lat: 25.1249, lng: 55.3899 },
    { id: "WRK-38475629", name: "Michael Brown", type: "Supervisor", role: "supervisor", site: "Site B", lat: 25.125, lng: 55.39 },
    // Site B - Foremen
    { id: "WRK-95837412", name: "Robert Taylor", type: "Foreman", role: "foreman", site: "Site B", lat: 25.1248, lng: 55.3898 },

    // Site C - Workers
    { id: "WRK-38475912", name: "Aisha Mohammed", type: "Electrician", role: "worker", site: "Site C", lat: 25.1151, lng: 55.3851 },
    { id: "WRK-47582916", name: "Ibrahim Saleh", type: "Mason", role: "worker", site: "Site C", lat: 25.1149, lng: 55.3849 },
    { id: "WRK-95837462", name: "Noor Ali", type: "Operator", role: "worker", site: "Site C", lat: 25.1152, lng: 55.3852 },
    { id: "WRK-83749261", name: "Zainab Hassan", type: "Painter", role: "worker", site: "Site C", lat: 25.115, lng: 55.385 },
    // Site C - Supervisors
    { id: "WRK-29384712", name: "Thomas Lee", type: "Supervisor", role: "supervisor", site: "Site C", lat: 25.1153, lng: 55.3853 },
    // Site C - Foremen
    { id: "WRK-74839218", name: "Christopher Martinez", type: "Foreman", role: "foreman", site: "Site C", lat: 25.1148, lng: 55.3848 },

    // Building A - Workers
    { id: "WRK-12345678", name: "Ali Abdullah", type: "Carpenter", role: "worker", site: "Building A", lat: 25.1181, lng: 55.3891 },
    { id: "WRK-23456789", name: "Hassan Mahmoud", type: "Laborer", role: "worker", site: "Building A", lat: 25.1182, lng: 55.3892 },
    // Building A - Foremen
    { id: "WRK-34567890", name: "Daniel White", type: "Foreman", role: "foreman", site: "Building A", lat: 25.118, lng: 55.389 },

    // Building B - Workers
    { id: "WRK-45678901", name: "Saeed Omar", type: "Electrician", role: "worker", site: "Building B", lat: 25.1221, lng: 55.3861 },
    { id: "WRK-56789012", name: "Rashid Khalil", type: "Plumber", role: "worker", site: "Building B", lat: 25.1222, lng: 55.3862 },
    // Building B - Supervisors
    { id: "WRK-67890123", name: "Jennifer Davis", type: "Supervisor", role: "supervisor", site: "Building B", lat: 25.122, lng: 55.386 },

    // Building C - Workers
    { id: "WRK-78901234", name: "Tariq Nasser", type: "Welder", role: "worker", site: "Building C", lat: 25.1161, lng: 55.3881 },
    // Building C - Foremen
    { id: "WRK-89012345", name: "William Garcia", type: "Foreman", role: "foreman", site: "Building C", lat: 25.116, lng: 55.388 },
  ];

  constructor(
    private mapTrackingService: MapTrackingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    // Clean up markers
    this.siteMarkers.forEach(marker => marker.setMap(null));
    this.workerMarkers.forEach(marker => marker.setMap(null));
    if (this.infoWindow) {
      this.infoWindow.close();
    }
  }

  initMap(): void {
    if (typeof google === "undefined" || !google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    const mapElement = document.getElementById("googleMapContainer");
    if (!mapElement) {
      console.error("Map container not found");
      return;
    }

    // Initialize map centered on Dubai Silicon Oasis
    this.map = new google.maps.Map(mapElement, {
      center: { lat: this.BASE_LAT, lng: this.BASE_LNG },
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    this.infoWindow = new google.maps.InfoWindow();

    // Add site markers
    this.addSiteMarkers();

    // Add worker markers
    this.addWorkerMarkers();

    // Fit bounds to show all markers
    this.fitBounds();

    this.cdr.detectChanges();
  }

  addSiteMarkers(): void {
    this.sites.forEach(site => {
      // Create custom icon for site (larger, different color)
      const siteIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#FF6B35",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 3,
      };

      const marker = new google.maps.Marker({
        position: { lat: site.lat, lng: site.lng },
        map: this.map,
        icon: siteIcon,
        title: site.name,
        zIndex: 1000,
      });

      // Add click listener to switch to 2D map view
      marker.addListener("click", () => {
        this.onSiteClick(site);
      });

      // Add info window on hover
      const infoContent = `
        <div style="padding: 8px;">
          <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${site.name}</h4>
          <p style="margin: 0; font-size: 14px; color: #666;">Workers: ${site.workerCount}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">Click to view 2D map</p>
        </div>
      `;

      marker.addListener("mouseover", () => {
        this.infoWindow.setContent(infoContent);
        this.infoWindow.open(this.map, marker);
      });

      marker.addListener("mouseout", () => {
        this.infoWindow.close();
      });

      this.siteMarkers.push(marker);
    });
  }

  addWorkerMarkers(): void {
    this.workers.forEach(worker => {
      // Create custom icon based on role
      let workerIcon;
      let zIndex;

      if (worker.role === "foreman") {
        // Foremen - Red/Purple, larger
        workerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#9B59B6",
          fillOpacity: 0.9,
          strokeColor: "#FFFFFF",
          strokeWeight: 3,
        };
        zIndex = 700;
      } else if (worker.role === "supervisor") {
        // Supervisors - Orange/Yellow, medium
        workerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: "#F39C12",
          fillOpacity: 0.85,
          strokeColor: "#FFFFFF",
          strokeWeight: 2.5,
        };
        zIndex = 600;
      } else {
        // Regular workers - Blue, smaller
        workerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#4A90E2",
          fillOpacity: 0.8,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        };
        zIndex = 500;
      }

      const marker = new google.maps.Marker({
        position: { lat: worker.lat, lng: worker.lng },
        map: this.map,
        icon: workerIcon,
        title: `${worker.name} - ${worker.type}`,
        zIndex: zIndex,
      });

      // Enhanced info window content
      const roleLabel = worker.role.charAt(0).toUpperCase() + worker.role.slice(1);
      const roleColor = worker.role === "foreman" ? "#9B59B6" : worker.role === "supervisor" ? "#F39C12" : "#4A90E2";

      const infoContent = `
        <div style="padding: 10px; min-width: 200px;">
          <h4 style="margin: 0 0 6px 0; font-size: 16px; font-weight: bold; color: #333;">${worker.name}</h4>
          <div style="margin: 4px 0;">
            <span style="display: inline-block; padding: 2px 8px; background-color: ${roleColor}; color: white; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase;">${roleLabel}</span>
          </div>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #666;">
            <strong>Type:</strong> ${worker.type}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
            <strong>ID:</strong> ${worker.id}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">
            <strong>Site:</strong> ${worker.site}
          </p>
        </div>
      `;

      // Add hover listeners for info window
      marker.addListener("mouseover", () => {
        this.infoWindow.setContent(infoContent);
        this.infoWindow.open(this.map, marker);
      });

      marker.addListener("mouseout", () => {
        this.infoWindow.close();
      });

      this.workerMarkers.push(marker);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSiteClick(_site: Site): void {
    // Switch to 2D map view (tab index 0)
    this.mapTrackingService.switchToTab(0);
  }

  fitBounds(): void {
    if (!this.map) return;

    const bounds = new google.maps.LatLngBounds();

    // Add all site markers to bounds
    this.siteMarkers.forEach(marker => {
      bounds.extend(marker.getPosition());
    });

    // Add all worker markers to bounds
    this.workerMarkers.forEach(marker => {
      bounds.extend(marker.getPosition());
    });

    // Fit map to bounds with padding
    this.map.fitBounds(bounds, { padding: 50 });
  }
}
