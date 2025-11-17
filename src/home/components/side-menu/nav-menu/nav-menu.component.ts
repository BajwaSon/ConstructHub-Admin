/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
// eslint-disable-next-line no-restricted-imports
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-nav-menu",
  imports: [RouterModule, CommonModule],
  templateUrl: "./nav-menu.component.html",
  styleUrl: "./nav-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent {
  @Output() logoutClicked = new EventEmitter<void>();
  private router = inject(Router);
  menuItems: any = [
    {
      label: "Dashboard",
      icon: "/assets/nav-icons/dashboard.svg",
      route: "/home/dashboard",
    },
    {
      label: "Site Map",
      icon: "/assets/nav-icons/2d-map-tracker.svg",
      route: "/home/monitor/map-tracking",
    },

    {
      label: "Worker Tracking",
      icon: "/assets/nav-icons/scheduling.svg",
      route: "/home/monitor/attendance-tracking",
    },

    {
      label: "Site Monitoring",
      icon: "/assets/nav-icons/school-monitoring.svg",
      route: "/home/monitor/school-monitoring",
    },
  ];

  clickedItemLabel: string | null = null;
  isActive(route: string): boolean {
    if (!route) return false;
    return this.router.url.includes(route);
  }

  isExpanded(item: any): boolean {
    if (!item.children) return false;
    return item.children.some((child: any) => {
      if (child.children) {
        return this.isExpanded(child);
      }
      return this.isActive(child.route || "");
    });
  }

  getCollapseId(label: string): string {
    return "collapse" + label.replace(/\s+/g, "");
  }

  onParentClick(item: any): void {
    if (item.children && item.children.length > 0) {
      const firstChild = item.children[0];
      if (firstChild.children && firstChild.children.length > 0) {
        this.router.navigate([firstChild.children[0].route]);
      } else {
        this.router.navigate([firstChild.route]);
      }
    }
  }

  onLogoutClick(): void {
    this.logoutClicked.emit();
  }
}
