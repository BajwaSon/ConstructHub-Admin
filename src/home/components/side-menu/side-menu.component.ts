import { ChangeDetectionStrategy, Component, inject, TemplateRef, ViewChild } from "@angular/core";
import { BaseComponent } from "../../../app/common/base.component";

import { RouterModule } from "@angular/router";
import { AuthService, RequestLoader, RippleButtonDirective, UserService } from "@jot143/core-angular";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AppService } from "../../../app/services/app.service";
import { AvatarService } from "../../../app/services/avatar.service";
import { StateService } from "../../../app/services/state.service";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { SideMenuService } from "./side-menu.service";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrl: "./side-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavMenuComponent, RippleButtonDirective, RouterModule],
  providers: [BsModalService],
})
export class SideMenuComponent extends BaseComponent {
  @ViewChild("logoutModal") logoutModal!: TemplateRef<unknown>;

  currentDate = new Date();
  startOfWeek = new Date(this.currentDate);
  avatarService = inject(AvatarService);
  sideMenuService = inject(SideMenuService);
  userService = inject(UserService);
  stateService = inject(StateService);
  appService = inject(AppService);
  authService = inject(AuthService);
  modalService = inject(BsModalService);
  openedModal!: BsModalRef;
  loader = new RequestLoader();
  // Define the title for the component
  override title: string = "SideMenuComponent";

  // Close the side menu
  closeSideMenu() {
    this.sideMenuService.open.next(false);
  }

  openLogoutModal() {
    this.openedModal = this.modalService.show(this.logoutModal, {
      class: "modal-dialog modal-dialog-centered",
    });
  }

  closeModal() {
    this.openedModal.hide();
  }

  logout() {
    this.closeModal();
    this.appService.sideBarOpen.setValue(false);
    this.authService.logout();
  }
}
