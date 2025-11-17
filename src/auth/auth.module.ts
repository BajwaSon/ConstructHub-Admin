import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";
import { ModalModule } from "ngx-bootstrap/modal";
import { SessionModalComponent } from "./session-modal/session-modal.component";

@NgModule({
  declarations: [],
  imports: [CommonModule, AuthRoutingModule, ModalModule.forRoot(), SessionModalComponent],
})
export class AuthModule {}
