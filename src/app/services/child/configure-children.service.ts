import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal } from "@jot143/core-angular";
import { BehaviorSubject, combineLatest } from "rxjs";
import { Child } from "../../model/Child";
import { ChildService } from "./child.service";

@Injectable({
  providedIn: "root",
})
export class ConfigureChildrenService {
  private childApi = {
    getChild: "child.index",
    addChild: "parent.child.add",
    getHealth: "parent.child.health.get",
    getPerformance: "parent.child.performance.get",
    getAttendance: "parent.child.attendance.get",
    getBehavior: "parent.child.behavior.get",
  };

  private apiService = inject(ApiService);
  private alertService = inject(AlertService);
  private childService = inject(ChildService);
  //

  children = coreSignal<Child[]>([], {
    tableName: "pre-loaded",
    key: "children",
    transform: async value => {
      return await Child.createFromArray<Child>(value);
    },
  });

  selectedChildId = coreSignal<number | null>(null, { tableName: "pre-loaded", key: "childId" });
  selectedChild = new BehaviorSubject<Child | null>(null);

  getChild() {
    const apiCall = this.apiService.apiCall(this.childApi.getChild);
    if (apiCall) {
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status === "OK") {
            const serverDetails = apiCall.response.data.children;
            const children = [];

            for (const server of serverDetails) {
              const child = new Child();
              child.id = server.childId;
              child.schoolId = server.schoolId;
              child.commonServerId = server.id;

              this.apiService
                .addBackend({
                  keyName: `child-${server.childId}`,
                  baseUrl: server.school.ssl ? `https://${server.school.domain}` : `http://${server.school.domain}`,
                  routesUrl: "/api/web-panel/all-routes",
                })
                .then(() => {
                  child.serverSetup.next(true);
                });

              child.serverSetup.subscribe(setup => {
                if (setup) {
                  this.childService.getChildDetail(child);
                }
              });

              children.push(child);
            }

            this.syncChildren(children);
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async error => {
          this.alertService.error(error.message || "Something went wrong");
        },
      });
      apiCall.exe().subscribe();
    }

    return apiCall;
  }

  async syncChildren(serverChildren: Child[]) {
    const cSetup = serverChildren.map(c => {
      return c.populated;
    });

    combineLatest(cSetup).subscribe({
      next: args => {
        if (args.every(a => a === true)) {
          this.children.setValue(serverChildren);
        }
      },
    });
  }
  addChild({ childName, childLevel, childClass }: { childName: string; childLevel: string; childClass: string }) {
    const apiCall = this.apiService.apiCall(this.childApi.addChild);
    // apiCall.loader = loader;
    apiCall.data = { childName, childLevel, childClass };
    apiCall.exe().subscribe();
    return apiCall;
  }

  setDefaultChild() {
    this.children.subject.subscribe(() => {
      const childId = this.selectedChildId();
      const child = this.children().find(c => c.id === childId);
      if (child) {
        this.selectedChild.next(child);
      } else if (this.children().length > 0) {
        this.selectedChild.next(this.children()[0]);
        this.selectedChildId.setValue(this.children()[0].id as number);
      }
    });
  }
}
