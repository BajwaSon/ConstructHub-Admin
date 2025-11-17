import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BaseComponent } from "@jot143/core-angular";
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { SideMenuService } from "../../components/side-menu/side-menu.service";
import { TopHeaderComponent } from "../../components/top-header/top-header.component";
@Component({
  selector: "app-vertical-panel",
  imports: [SideMenuComponent, RouterModule, TopHeaderComponent],
  providers: [SideMenuService],
  templateUrl: "./vertical-panel.component.html",
  styleUrl: "./vertical-panel.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalPanelComponent extends BaseComponent {
  override title: string = "VerticalPanelComponent";

  logout() {}
}
