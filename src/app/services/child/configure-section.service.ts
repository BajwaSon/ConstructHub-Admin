/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";
import { AlertService, ApiService, coreSignal } from "@jot143/core-angular";
import { BehaviorSubject } from "rxjs";
import { ClassSection } from "../../model/ClassSection";
import { Child } from "../../model/Child";

// import { ClassSection } from "src/app/model/teacher";

@Injectable({
  providedIn: "root",
})
export class ConfigureSectionService {
  private childApi = {
    // getChild: "child.index",
    getClassSection: "school.classSection.getAll",
    // getClassSection: "master.teacher.getClassSection",
    getClassSectionById: "master.child.getByClassSectionId",
    addChild: "parent.child.add",
  };

  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  classSections: any = coreSignal([]);

  selectedClassSectionId = coreSignal<number | null>(null, { tableName: "pre-loaded", key: "teacherId" });
  selectedClassSection = new BehaviorSubject<ClassSection | null>(null);
  childrens = coreSignal<Child[]>([], {
    tableName: "pre-loaded",
    key: "children",
    transform: async value => {
      return await Child.createFromArray<Child>(value);
    },
  });

  selectedChildId = coreSignal<number | null>(null, { tableName: "pre-loaded", key: "childId" });
  selectedChildren = new BehaviorSubject<Child | null>(null);

  async getClassSections() {
    const apiCall = await this.apiService.apiCall(this.childApi.getClassSection);
    if (apiCall) {
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status === "OK") {
            const classSections = apiCall.response.data.classSections;
            this.classSections.setValue(classSections);
            // if (this.classSections().length > 0) {
            //   const selectedSectionId = this.classSections[0].id;
            //   await this.getByClassSectionId(selectedSectionId);
            // }
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async error => {
          console.error("An error occurred:", error);
        },
      });
      apiCall.exe().subscribe();
    }

    return apiCall;
  }

  addChild({ childName, childLevel, childClass }: { childName: string; childLevel: string; childClass: string }) {
    const apiCall = this.apiService.apiCall(this.childApi.addChild);
    // apiCall.loader = loader;
    apiCall.data = { childName, childLevel, childClass };
    apiCall.exe().subscribe();
    return apiCall;
  }

  getByClassSectionId(classSectionId: any) {
    const apiCall = this.apiService.apiCall(this.childApi.getClassSectionById);
    apiCall.data = { classSectionId };
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          const children: any = await Child.createFromArray(apiCall.response.data);
          this.childrens.setValue(children);
          this.setDefaultChild();
          return;
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async (err: Error) => {
        this.alertService.error(err.message);
      },
    });

    apiCall.exe().subscribe();

    return apiCall;
  }
  setDefaultChild() {
    this.childrens.subject.subscribe(() => {
      const childId = this.selectedChildId();
      const child = this.childrens().find((c: any) => c.id === childId);
      if (child) {
        this.selectedChildren.next(child);
      } else if (this.childrens().length > 0) {
        this.selectedChildren.next(this.childrens()[0]);
        this.selectedChildId.setValue(this.childrens()[0].id as number);
      }
    });
  }
  setDefaultClassSection() {
    this.classSections.subject.subscribe(() => {
      const classSectionId = this.selectedClassSectionId();
      const classSection = this.classSections().find((c: any) => c.id === classSectionId);
      if (classSection) {
        this.selectedClassSection.next(classSection);
      } else if (this.classSections().length > 0) {
        this.selectedClassSection.next(this.classSections()[0]);
        this.selectedClassSectionId.setValue(this.classSections()[0].id as number);
        this.getByClassSectionId(this.classSections()[0].id);
      }
    });
  }
}
