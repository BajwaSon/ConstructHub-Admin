import { Injectable } from "@angular/core";
import { StateService as BaseStateService, LocalStorageService } from "@jot143/core-angular";
import { AppConstant } from "../common/Constant";

@Injectable({
  providedIn: "root",
})
export class StateService extends BaseStateService {
  constructor() {
    super();
  }

  appDefault = {
    baseScenario: "SAP",
    site: null,
    planningHorizon: "N (adjusted)",
    reportPlanningHorizon: "N (SAP Schedule)",
    role: "viewer",
  };

  get role() {
    return LocalStorageService.get(AppConstant.ROLE) ?? this.appDefault.role;
  }

  set role(val) {
    LocalStorageService.set(AppConstant.ROLE, val);
  }
}
