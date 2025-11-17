import { CanActivate, UrlTree } from "@angular/router";

import { inject, Injectable } from "@angular/core";
import { NavigationService, StateService } from "@jot143/core-angular";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PermanentPasswordGuard implements CanActivate {
  private stateService = inject(StateService);
  private router = inject(NavigationService);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isPermanentPasswordSet = !this.stateService.user.tempPassword;

    if (!isPermanentPasswordSet) {
      this.router.navigateForward("/checkpoint/set-password");
      return false;
    }
    return true;
  }
}
