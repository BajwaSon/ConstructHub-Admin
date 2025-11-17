import { NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { NavigationService } from "@jot143/core-angular";
import { PageComponent } from "../../app/common/page.component";

@Component({
  selector: "app-welcome",
  imports: [NgOptimizedImage, MatButtonModule],
  templateUrl: "./welcome.component.html",
})
export class WelcomeComponent extends PageComponent {
  title: string = "Welcome Page";

  private router = inject(NavigationService);

  start() {
    this.router.navigateForward("/auth/login");
  }
}
