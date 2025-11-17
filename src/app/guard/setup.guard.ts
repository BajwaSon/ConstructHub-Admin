import { CanActivate, UrlTree } from "@angular/router";

import { inject, Injectable } from "@angular/core";
import { NavigationService, StateService } from "@jot143/core-angular";
import { map, Observable, switchMap, take } from "rxjs";
import { AppService } from "../services/app.service";

@Injectable({
  providedIn: "root",
})
export class SetupGuard implements CanActivate {
  private stateService = inject(StateService);
  private router = inject(NavigationService);
  private appService = inject(AppService);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Always fetch sessions to ensure latest state
    return this.appService.getSchoolSessions().subject.pipe(
      take(1),
      switchMap(() => this.appService.sessions.subject.pipe(take(1))),
      map(sessions => {
        const isInitialSetup = sessions && sessions.length > 0;
        if (!isInitialSetup) {
          // Use setTimeout to avoid navigation conflicts
          setTimeout(() => {
            this.router.navigateRoot("/school-registration");
          }, 0);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
