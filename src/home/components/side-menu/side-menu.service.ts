import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { StateService } from "../../../app/services/state.service";

@Injectable()
export class SideMenuService {
  private stateService = inject(StateService);

  open = new BehaviorSubject(false);

  sideBarMenu: Signal<{ link: string; icon: string; label: string }[]> = signal([
    {
      link: "/home/scenario-summary",
      icon: "fa-wand-magic-sparkles",
      label: "What If Scenario",
    },
    {
      link: "/home/analyze-view",
      icon: "fa-magnifying-glass-chart",
      label: "Scenario Analysis",
    },
    {
      link: "/home/custom-report",
      icon: "fa-file-lines",
      label: "Custom Reports",
    },
    {
      link: "/home/actual-vs-expected",
      icon: "fa-code-compare",
      label: "Site Analysis",
    },
    {
      link: "/home/admin-control",
      icon: "fa-sliders",
      label: "Site Configuration",
    },
    {
      link: "/home/truck-delivery",
      icon: "fa-solid fa-truck-fast",
      label: "Truck Delivery",
    },
    {
      link: "/home/super-admin/user-logs",
      icon: "fa-solid fa-chart-simple",
      label: "Application Usage Statistics",
    },
    {
      link: "/home/user-management",
      icon: "fa-users",
      label: "User Management",
    },
  ]);

  sideBarMenuFiltered = computed(() => {
    if (this.stateService.role === "viewer") {
      return this.sideBarMenu().filter(item => item.label !== "Site Configuration" && item.label !== "Application Usage Statistics" && item.label !== "User Management");
    } else if (this.stateService.role == "admin") {
      return this.sideBarMenu().filter(item => item.label !== "Application Usage Statistics" && item.label !== "User Management");
    } else if (this.stateService.role == "global_admin") {
      return this.sideBarMenu().filter(item => {
        if (item.label == "User Management") {
          return false;
        }
        return true;
      });
    } else if (this.stateService.role == "global_viewer") {
      return this.sideBarMenu().filter(item => item.label !== "Site Configuration" && item.label !== "Application Usage Statistics" && item.label !== "User Management");
    }
    return this.sideBarMenu();
  });
}
