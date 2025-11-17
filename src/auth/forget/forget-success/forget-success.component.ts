import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PageComponent } from "../../../app/common/page.component";
import { NavigationService } from "@jot143/core-angular";

@Component({
  selector: "app-forget-success",
  imports: [],
  templateUrl: "./forget-success.component.html",
  styleUrl: "../../auth.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetSuccessComponent extends PageComponent {
  override title = "Forget Password - Forget Success";

  // inject dependencies
  router = inject(NavigationService);

  gotoLogin() {
    this.router.navigateRoot("/auth/login");
  }
}
