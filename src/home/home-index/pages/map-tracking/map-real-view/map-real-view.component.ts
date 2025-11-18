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
  avatar: string;
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
  sites: Site[] = [{ name: "Site A", lat: 25.1202, lng: 55.3876, workerCount: 5 }];

  workers: Worker[] = [
    {
      id: "WRK-86234696",
      name: "Ahmed Hassan",
      type: "Carpenter",
      role: "worker",
      site: "Site A",
      lat: 25.12047,
      lng: 55.38879,
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      id: "WRK-23984712",
      name: "Mohammed Ali",
      type: "Laborer",
      role: "worker",
      site: "Site A",
      lat: 25.121,
      lng: 55.389,
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      id: "WRK-38475621",
      name: "Omar Ibrahim",
      type: "Electrician",
      role: "worker",
      site: "Site A",
      lat: 25.1205,
      lng: 55.3891,
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    },
    {
      id: "WRK-56372819",
      name: "Khalid Ahmed",
      type: "Plumber",
      role: "worker",
      site: "Site A",
      lat: 25.1205,
      lng: 55.3892,
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
      id: "WRK-98472635",
      name: "Sarah Johnson",
      type: "Supervisor",
      role: "supervisor",
      site: "Site A",
      lat: 25.12055,
      lng: 55.38915,
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      id: "WRK-29384756",
      name: "David Wilson",
      type: "Supervisor",
      role: "supervisor",
      site: "Site A",
      lat: 25.12045,
      lng: 55.3895,
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      id: "WRK-84736291",
      name: "James Anderson",
      type: "Foreman",
      role: "foreman",
      site: "Site A",
      lat: 25.1205,
      lng: 55.3896,
      avatar: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
      id: "WRK-984726351",
      name: "John Doe",
      type: "Carpenter",
      role: "worker",
      site: "Site A",
      lat: 25.12041,
      lng: 55.3891,
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
      id: "WRK-293847561",
      name: "Kane Lee",
      type: "Supervisor",
      role: "worker",
      site: "Site A",
      lat: 25.12059,
      lng: 55.38919,
      avatar: "https://randomuser.me/api/portraits/men/57.jpg",
    },
    {
      id: "WRK-847362911",
      name: "Jule Quinn",
      type: "Electrician",
      role: "worker",
      site: "Site A",
      lat: 25.12051,
      lng: 55.38923,
      avatar: "https://randomuser.me/api/portraits/men/73.jpg",
    },
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
      zoom: 18,
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
    // this.addSiteMarkers();

    // Add worker markers
    this.addWorkerMarkers();

    // Fit bounds to show all markers, then set zoom to 18
    this.fitBounds();

    // Ensure zoom level 18 is maintained after fitBounds
    google.maps.event.addListenerOnce(this.map, "bounds_changed", () => {
      this.map.setZoom(18);
    });

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
        <div style="padding: 0 10px 10px; min-width: 200px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${worker.avatar}"
                style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid #ddd;" />
            <div>
              <h4 style="margin: 0; font-size: 16px; font-weight: bold; color: #333;font-family: "Host Grotesk", serif;">${worker.name}</h4>
              <span style="display:block; margin-top:2px; font-size:12px; color:#888;font-family: "Host Grotesk", serif;">${worker.type}</span>
            </div>
          </div>
          <div style="margin-top:8px;">
            <span style="display:inline-block; padding:2px 8px; background-color:${roleColor}; color:white; border-radius:12px; font-size:11px; text-transform:uppercase; font-weight:600;font-family: "Host Grotesk", serif;">
              ${roleLabel}
            </span>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;font-family: "Host Grotesk", serif;">
            <strong>Type:</strong> ${worker.type}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;font-family: "Host Grotesk", serif;">
            <strong>ID:</strong> ${worker.id}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #999;font-family: "Host Grotesk", serif;">
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
