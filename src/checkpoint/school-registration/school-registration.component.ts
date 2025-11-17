/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-escape */
// school-registration.component.ts
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, ApiService, coreSignal, NavigationService, RequestLoader, UserService } from "@jot143/core-angular";
import { InputNumberCountryCodeComponent } from "../../app/ngx-components/input-number-country-code/input-number-country-code.component";
import { InputComponent } from "../../app/ngx-components/input/input.component";
import { InputNumberComponent } from "../../app/ngx-components/number/number.component";
import { SchoolRegistrationService } from "../../app/services/school.service";
import { SubmitOnEnterDirective } from "../../app/shared/directives/submit-on-enter.directive";
import moment from "moment";
import { SingleSelectComponent } from "../../home/components/single-select/single-select.component";
import { AppService } from "../../app/services/app.service";

@Component({
  selector: "app-school-registration",
  imports: [CommonModule, ReactiveFormsModule, SubmitOnEnterDirective, FormsModule, InputComponent, InputNumberComponent, InputNumberCountryCodeComponent, SingleSelectComponent],
  templateUrl: "./school-registration.component.html",
  styleUrls: ["./school-registration.component.scss"],
})
export class SchoolRegistrationComponent implements OnInit {
  // Component State
  currentStep: number = 1;
  isLoading: boolean = false;
  showAdminPanel: boolean = false;
  totalSteps: number = 5;
  isSubmitting: boolean = false;
  registrationComplete: boolean = false;
  router = inject(NavigationService);
  schoolService = inject(SchoolRegistrationService);
  appService = inject(AppService);
  loader = new RequestLoader();
  fb = inject(FormBuilder);
  alertService = inject(AlertService);
  userService = inject(UserService);

  // Configuration Data
  steps = [
    { id: 1, title: "School Details", icon: "school", description: "Basic school information" },
    { id: 2, title: "School Sessions", icon: "schedule", description: "Configure class sessions" },
    { id: 3, title: "Additional Info", icon: "info", description: "School type and details" },
    { id: 4, title: "Review & Submit", icon: "check", description: "Review and submit" },
  ];

  schoolTypes: any[] = [
    { value: "public", label: "Public School" },
    { value: "private", label: "Private School" },
    { value: "charter", label: "Charter School" },
    { value: "international", label: "International School" },
    { value: "montessori", label: "Montessori School" },
    { value: "waldorf", label: "Waldorf School" },
  ];

  // Validation States
  validationErrors: { [key: string]: string } = {};
  isValidating: boolean = false;
  genderOptions = coreSignal<any[]>([
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    // { value: "other", label: "Other" },
  ]);
  sessionLists = coreSignal<any[]>([
    { value: "2020-2021", label: "2020-2021" },
    { value: "2021-2022", label: "2021-2022" },
    { value: "2022-2023", label: "2022-2023" },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
    { value: "2026-2027", label: "2026-2027" },
    { value: "2027-2028", label: "2027-2028" },
    { value: "2028-2029", label: "2028-2029" },
    { value: "2029-2030", label: "2029-2030" },
    { value: "2030-2031", label: "2030-2031" },
    { value: "2031-2032", label: "2031-2032" },
    { value: "2032-2033", label: "2032-2033" },
    { value: "2033-2034", label: "2033-2034" },
    { value: "2034-2035", label: "2034-2035" },
  ]);
  sessionData = this.getDefaultSessionData();

  schoolForm = new FormGroup({
    // Step 1: IRAS Setup ID
    schoolId: new FormControl<string>("", [
      Validators.required,
      Validators.pattern(/^\d+$/), // Only numeric values
      Validators.minLength(6), // Minimum 6 characters
      Validators.maxLength(6), // Maximum 6 characters
    ]),
    // Step 2: School Details
    schoolName: new FormControl<string>("", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    principalFirstName: new FormControl<string>("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    principalMiddleName: new FormControl<string>("", [Validators.maxLength(50)]),
    principalLastName: new FormControl<string>("", [Validators.maxLength(50)]),
    principalGender: new FormControl<string>("male", [Validators.required]),
    address: new FormControl<string>("", [Validators.required]),
    email: new FormControl<string>("", [Validators.required, Validators.email]),
    phone: new FormControl<string>("", [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]),

    // Step 2: School Session (single group)
    session: new FormGroup(
      {
        name: new FormControl<string>("", [Validators.required]),
        sessionStartDate: new FormControl<string>(this.sessionData.sessionStartDate, [Validators.required, this.dateFormatValidator.bind(this)]),
        sessionEndDate: new FormControl<string>(this.sessionData.sessionEndDate, [Validators.required, this.dateFormatValidator.bind(this)]),
        isActive: new FormControl<boolean>(this.sessionData.isActive),
      },
      { validators: this.dateRangeValidator.bind(this) }
    ),

    // Step 3: Additional Info
    establishedYear: new FormControl<number>(new Date().getFullYear(), [Validators.required]),
    schoolType: new FormControl<string>("", [Validators.required]),
    description: new FormControl<string>("", [Validators.maxLength(1000)]),
  });

  ngOnInit(): void {
    const currentSession = this.getCurrentSession();
    if (currentSession) {
      this.onSessionNameChange(currentSession.value);
    } else {
      this.onSessionNameChange(this.sessionLists()[0].value);
    }
    if (this.schoolForm.get("principalGender")?.value == "") {
      this.schoolForm.get("principalGender")?.setValue("male");
    }
  }

  onGenderChange(selectedGender: string) {
    this.schoolForm.patchValue({ principalGender: selectedGender });
  }

  // Method to determine current session based on current date
  getCurrentSession(): any | null {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    // Session runs from August 1st to July 31st
    // If current month is August (8) to December (12), session is currentYear-currentYear+1
    // If current month is January (1) to July (7), session is currentYear-1-currentYear

    let sessionStartYear: number;
    let sessionEndYear: number;

    if (currentMonth >= 8) {
      // August to December - current session is currentYear to currentYear+1
      sessionStartYear = currentYear;
      sessionEndYear = currentYear + 1;
    } else {
      // January to July - current session is currentYear-1 to currentYear
      sessionStartYear = currentYear - 1;
      sessionEndYear = currentYear;
    }

    const sessionName = `${sessionStartYear}-${sessionEndYear}`;

    // Find the session in the sessionLists
    return this.sessionLists().find(session => session.value == sessionName) || null;
  }

  // Custom validator for date format (dd-mm-yyyy)
  private dateFormatValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null; // Let required validator handle empty fields
    }

    // Check if the format matches dd-mm-yyyy
    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      return { invalidDateFormat: true };
    }

    // Validate the date
    const date = this.parseDateFromDisplay(value);
    if (!date) {
      return { invalidDateFormat: true };
    }

    return null;
  }

  // Custom validator for date comparison
  private dateRangeValidator(group: AbstractControl): { [key: string]: any } | null {
    const startDate = group.get("sessionStartDate")?.value;
    const endDate = group.get("sessionEndDate")?.value;

    if (!startDate || !endDate) {
      return null; // Let required validator handle empty fields
    }

    const start = this.parseDateFromDisplay(startDate);
    const end = this.parseDateFromDisplay(endDate);

    if (!start || !end) {
      return { invalidDateFormat: true };
    }

    if (start >= end) {
      return { invalidDateRange: true };
    }

    return null;
  }

  // Generate default session name and dates
  getDefaultSessionData() {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    // const sessionName = `${previousYear}-${currentYear}`;

    // Start date: August 1st of previous year
    const startDate = new Date(previousYear, 7, 1); // Month is 0-indexed, so 7 = August
    // End date: July 31st of current year
    const endDate = new Date(currentYear, 6, 31); // Month is 0-indexed, so 6 = July

    const payload = {
      // name: sessionName,
      sessionStartDate: this.formatDateForDisplay(startDate), // Format as dd-mm-yyyy
      sessionEndDate: this.formatDateForDisplay(endDate), // Format as dd-mm-yyyy
      isActive: true,
    };
    return payload;
  }

  // Format date to dd-mm-yyyy for display
  formatDateForDisplay(date: Date): string {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Parse dd-mm-yyyy format to Date object
  parseDateFromDisplay(dateString: string): Date | null {
    if (!dateString || !/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return null;
    }

    const [day, month, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed

    // Validate the date
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return null;
    }

    return date;
  }

  // Convert dd-mm-yyyy to yyyy-mm-dd for form submission
  formatDateForSubmission(dateString: string): string {
    const date = this.parseDateFromDisplay(dateString);
    if (!date) return "";

    return date.toISOString().split("T")[0]; // Returns yyyy-mm-dd
  }

  nextStep() {
    if (this.isStepValid()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      } else {
        this.submitForm();
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      // this.clearValidationErrors();
    }
  }
  onSessionNameChange(selectedSession: string) {
    // Parse years from session string
    const match = selectedSession.match(/(\d{4})-(\d{4})/);
    if (match) {
      const startYear = parseInt(match[1], 10);
      const endYear = parseInt(match[2], 10);

      // Format dates as dd-mm-yyyy
      const sessionStartDate = `01-08-${startYear}`;
      const sessionEndDate = `31-07-${endYear}`;
      this.sessionGroup.patchValue({
        name: selectedSession,
        sessionStartDate,
        sessionEndDate,
      });
    } else {
      // fallback: just set the name
      this.sessionGroup.patchValue({ name: selectedSession });
    }
  }
  goToStep(stepNumber: number): void {
    if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
      // Only allow navigation to completed steps or next step
      if (stepNumber <= this.currentStep || this.isStepValid()) {
        this.currentStep = stepNumber;
        // this.clearValidationErrors();
      }
    }
  }

  // ==================== VALIDATION METHODS ====================
  isStepValid(): boolean {
    if (this.currentStep === 1) {
      return this.schoolForm.get("schoolId")?.valid === true;
    }
    if (this.currentStep === 2) {
      return (
        this.schoolForm.get("schoolName")?.valid === true &&
        this.schoolForm.get("principalFirstName")?.valid === true &&
        this.schoolForm.get("principalMiddleName")?.valid === true &&
        this.schoolForm.get("principalLastName")?.valid === true &&
        this.schoolForm.get("address")?.valid === true &&
        this.schoolForm.get("email")?.valid === true &&
        this.schoolForm.get("phone")?.valid === true
      );
    }
    if (this.currentStep === 3) {
      return this.schoolForm.get("session")?.valid === true;
    }
    if (this.currentStep === 4) {
      return this.schoolForm.get("establishedYear")?.valid === true && this.schoolForm.get("schoolType")?.valid === true;
    }
    // For review/submit step, just check the whole form
    return this.schoolForm.valid === true;
  }

  // ==================== FORM SUBMISSION ====================
  async submitForm() {
    const formData = this.schoolForm.value;
    if (this.schoolForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.isLoading = true;

      try {
        // Format data as { meta: {...}, session: {...} }
        const payload: any = {
          meta: {
            schoolId: formData.schoolId,
            schoolName: formData.schoolName,
            principalFirstName: formData.principalFirstName,
            principalMiddleName: formData.principalMiddleName,
            principalLastName: formData.principalLastName,
            principalGender: formData.principalGender,
            address: formData.address,
            email: formData.email,
            phone: formData.phone,
            establishedYear: formData.establishedYear,
            schoolType: formData.schoolType,
            description: formData.description,
          },
          session: {
            ...formData.session,
            // Convert dates from dd-mm-yyyy to yyyy-mm-dd for API
            sessionStartDate: formData.session?.sessionStartDate || "",
            sessionEndDate: formData.session?.sessionEndDate || "",
          },
        };

        const apiCall = await this.schoolService.registerSchool(payload, this.loader);
        apiCall.subject.subscribe({
          next: async () => {
            if (apiCall.response.status == "OK") {
              this.alertService.success(apiCall.response.message || "School registered successfully");
              this.appService.getSchoolSessions();
              this.userService.me();
              this.registrationComplete = true;
              this.showAdminPanel = true;
            } else {
              this.alertService.error(apiCall.response.message || "Something went wrong");
            }
          },
          error: async (err: Error) => {
            this.alertService.error(err.message || "Something went wrong");
          },
        });
      } catch (error) {
        this.registrationComplete = false;
        this.showAdminPanel = false;
      } finally {
        this.isSubmitting = false;
        this.isLoading = false;
      }
    }
  }

  getStepClass(stepNumber: number): string {
    if (stepNumber < this.currentStep) return "completed";
    if (stepNumber === this.currentStep) return "active";
    return "";
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  getSchoolTypeLabel(value: string): string {
    const schoolType = this.schoolTypes.find(type => type.value === value);
    return schoolType ? schoolType.label : value;
  }

  getPrincipalFullName(): string {
    const firstName = this.schoolForm.get("principalFirstName")?.value || "";
    const middleName = this.schoolForm.get("principalMiddleName")?.value || "";
    const lastName = this.schoolForm.get("principalLastName")?.value || "";

    return [firstName, middleName, lastName].filter(name => name.trim()).join(" ");
  }

  getAdminStats(): any {
    return {
      students: 1,
      teachers: 3,
      staff: 0,
      nurses: 0,
      busAssistant: 0,
      sessions: 0,
    };
  }

  getTotalCapacity(): number {
    return 0;
  }

  getSessionSummary(): string {
    return "";
  }

  resetForm(): void {
    this.schoolForm.reset();
    this.currentStep = 1;
    this.clearValidationErrors();
    this.schoolForm.patchValue({
      establishedYear: new Date().getFullYear(),
      session: this.getDefaultSessionData(),
    });
  }

  startOver(): void {
    this.resetForm();
    this.showAdminPanel = false;
    this.registrationComplete = false;
  }

  exportFormData(): void {
    const formData = this.schoolForm.value;
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "school-registration-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  // ==================== VALIDATION HELPERS ====================
  private showValidationErrors(): void {
    this.markFormGroupTouched(this.schoolForm);
  }

  private clearValidationErrors(): void {
    this.validationErrors = {};
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl: AbstractControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  // ==================== GETTERS ====================
  get hasValidationErrors(): boolean {
    return Object.keys(this.validationErrors).length > 0;
  }

  get canProceed(): boolean {
    return this.isStepValid() && !this.isSubmitting;
  }

  get isFirstStep(): boolean {
    return this.currentStep === 1;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  get currentStepTitle(): string {
    const step = this.steps.find(s => s.id === this.currentStep);
    return step ? step.title : "";
  }

  get currentStepDescription(): string {
    const step = this.steps.find(s => s.id === this.currentStep);
    return step ? step.description : "";
  }

  // ==================== FORM CONTROL GETTERS ====================
  get schoolNameControl(): FormControl {
    return this.schoolForm.get("schoolName") as FormControl;
  }

  get principalFirstNameControl(): FormControl {
    return this.schoolForm.get("principalFirstName") as FormControl;
  }

  get principalMiddleNameControl(): FormControl {
    return this.schoolForm.get("principalMiddleName") as FormControl;
  }

  get principalLastNameControl(): FormControl {
    return this.schoolForm.get("principalLastName") as FormControl;
  }

  get addressControl(): FormControl {
    return this.schoolForm.get("address") as FormControl;
  }

  get emailControl(): FormControl {
    return this.schoolForm.get("email") as FormControl;
  }

  get phoneControl(): FormControl {
    return this.schoolForm.get("phone") as FormControl;
  }

  get establishedYearControl(): FormControl {
    return this.schoolForm.get("establishedYear") as FormControl;
  }

  get schoolTypeControl(): FormControl {
    return this.schoolForm.get("schoolType") as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.schoolForm.get("description") as FormControl;
  }

  // ==================== FORM CONTROL HELPERS ====================
  getControlError(controlName: string): string | null {
    const control = this.schoolForm.get(controlName);
    if (control && control.invalid && control.touched) {
      if (control.errors?.["required"]) return `${controlName} is required`;
      if (control.errors?.["email"]) return "Please enter a valid email address";
      if (control.errors?.["minlength"]) return `${controlName} must be at least ${control.errors["minlength"].requiredLength} characters`;
      if (control.errors?.["maxlength"]) return `${controlName} must not exceed ${control.errors["maxlength"].requiredLength} characters`;
      if (control.errors?.["min"]) return `${controlName} must be at least ${control.errors["min"].min}`;
      if (control.errors?.["max"]) return `${controlName} must not exceed ${control.errors["max"].max}`;
      if (control.errors?.["pattern"]) {
        // Special handling for schoolId pattern validation
        if (controlName === "schoolId") {
          return "School ID must contain only numeric characters";
        }
        return `Please enter a valid ${controlName}`;
      }
    }
    return null;
  }

  getSessionControlError(sessionIndex: number, controlName: string): string | null {
    const sessionGroup = this.schoolForm.get("session") as FormGroup;
    const control = sessionGroup.get(controlName);
    if (control && control.invalid && control.touched) {
      if (control.errors?.["required"]) return `${controlName} is required`;
      if (control.errors?.["minlength"]) return `${controlName} must be at least ${control.errors["minlength"].requiredLength} characters`;
      if (control.errors?.["maxlength"]) return `${controlName} must not exceed ${control.errors["maxlength"].requiredLength} characters`;
      if (control.errors?.["min"]) return `${controlName} must be at least ${control.errors["min"].min}`;
      if (control.errors?.["max"]) return `${controlName} must not exceed ${control.errors["max"].max}`;
    }
    return null;
  }

  // ==================== SESSION FORM CONTROL HELPERS ====================
  getSessionControl(sessionIndex: number, controlName: string): FormControl {
    const sessionGroup = this.schoolForm.get("session") as FormGroup;
    return sessionGroup.get(controlName) as FormControl;
  }

  get sessionGroup(): FormGroup {
    return this.schoolForm.get("session") as FormGroup;
  }

  get sessionNameControl(): FormControl {
    return this.schoolForm.get("session.name") as FormControl;
  }

  goToDashboard(): void {
    this.router.navigateForward("/home/dashboard");
  }
}
