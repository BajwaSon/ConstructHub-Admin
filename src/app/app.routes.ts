import { Routes } from "@angular/router";
import { AuthGuard, HomeGuard } from "@jot143/core-angular";
import { PermanentPasswordReverseGuard } from "./guard/permanent-password-reverse.guard";
import { PermanentPasswordGuard } from "./guard/permanent-password.guard";
import { homeRoutes } from "../home/home.routes";
import { SetupReverseGuard } from "./guard/setup-reverse.guard";
import { SetupGuard } from "./guard/setup.guard";
export const routes: Routes = [
  { path: "", loadComponent: () => import("../public/welcome/welcome.component").then(c => c.WelcomeComponent), data: { name: "WelcomePage" } },
  { path: "auth", loadChildren: () => import("../auth/auth.module").then(m => m.AuthModule), data: { name: "AuthPage" }, canLoad: [AuthGuard] },
  {
    path: "checkpoint",
    loadChildren: () => import("../checkpoint/checkpoint.module").then(m => m.CheckpointModule),
    data: { name: "CheckpointPage" },
    // canActivate: [HomeGuard, PermanentPasswordReverseGuard],
  },
  {
    path: "school-registration",
    loadComponent: () => import("../checkpoint/school-registration/school-registration.component").then(m => m.SchoolRegistrationComponent),
    // canActivate: [SetupReverseGuard]
  },
  {
    path: "home",
    loadComponent: () => import("../home/layout/vertical-panel/vertical-panel.component").then(m => m.VerticalPanelComponent),
    data: { name: "HomePage" },
    // canActivate: [HomeGuard, PermanentPasswordGuard, SetupGuard],
    children: homeRoutes,
  },
  {
    path: "**",
    loadComponent: () => import("../public/not-found/not-found.component").then(m => m.NotFoundComponent),
    data: { name: "NotFoundPage" },
  },
];
