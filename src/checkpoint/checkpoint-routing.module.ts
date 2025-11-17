import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SetPasswordComponent } from "./set-password/set-password.component";
import { SchoolRegistrationComponent } from "./school-registration/school-registration.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "set-password",
    pathMatch: "full",
  },
  {
    path: "set-password",
    component: SetPasswordComponent,
  },
  {
    path: "school-registration",
    component: SchoolRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckpointRoutingModule {}
