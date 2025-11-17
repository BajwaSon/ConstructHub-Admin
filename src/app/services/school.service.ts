/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from "@angular/core";
import { ApiService, AlertService, RequestLoader, coreSignal } from "@jot143/core-angular";

// ==================== SERVICE ====================
@Injectable({
  providedIn: "root",
})
export class SchoolRegistrationService {
  api = {
    registerSchool: "config.school.setup",
    getSchoolConfiguration: "config.school.get",
    validateSchoolName: "school.validateName",
    validateEmail: "school.validateEmail",
  };

  private apiService = inject(ApiService);
  private alertService = inject(AlertService);

  schoolConfiguration = coreSignal<any>([]);

  getSchoolConfiguration(loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.getSchoolConfiguration);
    apiCall.loader = loader;
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status === "OK") {
          this.schoolConfiguration.setValue(apiCall.response.data);
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

  registerSchool({ meta, session }: { meta: any; session: any }, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.registerSchool);
    apiCall.data = { meta, session };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  validateSchoolName(name: string, loader = new RequestLoader()) {
    const apiCall = this.apiService.apiCall(this.api.validateSchoolName);
    apiCall.data = { name };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  validateEmail(email: string, loader = new RequestLoader()) {
    // Check if email is available
    const apiCall = this.apiService.apiCall(this.api.validateEmail);
    apiCall.data = { email };
    apiCall.loader = loader;
    apiCall.exe().subscribe();
    return apiCall;
  }

  // Mock validation methods for demo
  async validateSchoolNameAsync(name: string, loader?: RequestLoader) {
    // Simulate API call
    // await this.delay(500);
    return !["Test School", "Demo School"].includes(name);
  }

  async validateEmailAsync(email: string, loader?: RequestLoader) {
    // Simulate API call
    // await this.delay(500);
    return !["test@example.com", "demo@example.com"].includes(email);
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
