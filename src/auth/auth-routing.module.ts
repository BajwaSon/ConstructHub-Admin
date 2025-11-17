import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () => import("./login/login.component").then(c => c.LoginComponent),
    data: { name: "LoginPage" },
  },
  {
    path: "forgot-password",
    loadComponent: () => import("./forget/forget-password/forget-password.component").then(c => c.ForgetPasswordComponent),
    data: { name: "ForgetPage" },
  },
  {
    path: "forgot-password/otp-code",
    loadComponent: () => import("./forget/otp-code/otp-code.component").then(c => c.OtpCodeComponent),
    data: { name: "OtpCodePage" },
  },
  {
    path: "forgot-password/forget-success",
    loadComponent: () => import("./forget/forget-success/forget-success.component").then(c => c.ForgetSuccessComponent),
    data: { name: "ForgetSuccessPage" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
