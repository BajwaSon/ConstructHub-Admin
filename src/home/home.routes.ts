// import { Health } from "./../app/model/Health";
import { Routes } from "@angular/router";

export const homeRoutes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },

  //dashboard
  { path: "dashboard", loadComponent: () => import("./home-index/pages/department/department.component").then(m => m.DepartmentComponent) },

  // Monitor routes
  {
    path: "monitor/attendance-tracking",
    loadComponent: () => import("./home-index/pages/attendance-tracking/attendance-tracking.component").then(m => m.AttendanceTrackingComponent),
  },

  { path: "monitor/school-monitoring", loadComponent: () => import("./home-index/pages/school-monitoring/school-monitoring.component").then(m => m.SchoolMonitoringComponent) },

  { path: "monitor/map-tracking", loadComponent: () => import("./home-index/pages/map-tracking/map-tracking.component").then(m => m.MapTrackingComponent) },

  // Health routes
  { path: "health/health-tracking", loadComponent: () => import("./home-index/pages/health-tracking/health-tracking.component").then(m => m.HealthTrackingComponent) },

  // Department routes

  // Configuration routes
  { path: "configuration/department", loadComponent: () => import("./home-index/pages/appointments/appointments.component").then(m => m.AppointmentsComponent) },
  { path: "configuration/options/health-options", loadComponent: () => import("./home-index/pages/health-option/health-option.component").then(m => m.HealthOptionComponent) },

  // Settings route
  { path: "settings", loadComponent: () => import("./home-index/pages/settings/settings.component").then(m => m.SettingsComponent) },
];
