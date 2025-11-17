/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, coreSignal, RequestLoader, RippleButtonDirective } from "@jot143/core-angular";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { HealthService } from "../../../../app/services/child/health.service";
import { environment } from "../../../../environments/environment";
import { LoaderComponent } from "../loader/loader.component";
import { InputComponent } from "../../../../app/ngx-components/input/input.component";
import { DataNotFoundComponent } from "../data-not-found/data-not-found.component";

@Component({
  selector: "app-health-option",
  imports: [RippleButtonDirective, FormsModule, InputComponent, ReactiveFormsModule, LoaderComponent, DataNotFoundComponent],
  providers: [BsModalService],
  templateUrl: "./health-option.component.html",
  styleUrl: "./health-option.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthOptionComponent implements OnInit {
  @ViewChild("closeCanvas") closeCanvas!: ElementRef;
  @ViewChild("closeUpdateCanvas") closeUpdateCanvas!: ElementRef;
  isSearchVisible = false;
  modalService = inject(BsModalService);
  openedModal!: BsModalRef;
  profileImage: string | null = null;
  alertService = inject(AlertService);
  healthService = inject(HealthService);
  cdr = inject(ChangeDetectorRef);
  assetsUrl = environment.assetsUrl;
  healthSymptoms = [
    {
      id: 1,
      name: "Fever",
      iconUrl: "assets/icons/fever.svg",
    },
    {
      id: 2,
      name: "Headache",
      iconUrl: "assets/icons/headache.svg",
    },
    {
      id: 3,
      name: "Vomiting",
      iconUrl: "assets/icons/vomiting.svg",
    },
    {
      id: 4,
      name: "Cough",
      iconUrl: "assets/icons/cough.svg",
    },
    {
      id: 5,
      name: "Belly Pain",
      iconUrl: "assets/icons/belly-pain.svg",
    },
    {
      id: 6,
      name: "Injury",
      iconUrl: "assets/icons/injury.svg",
    },
    {
      id: 7,
      name: "Other Pain",
      iconUrl: "assets/icons/other-pain.svg",
    },
  ];
  healthOptionLoader = new RequestLoader();
  loader = new RequestLoader();
  addHealthSymptomsForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    profileImage: new FormControl<string | File | null>(null, [Validators.required]),
  });
  updateHealthSymptomsForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    profileImage: new FormControl<string | File | null>(null, [Validators.required]),
  });
  selectedHealthSymptoms = coreSignal<any>(null);
  ngOnInit(): void {
    this.healthService.getAllHealthSymptoms();
    // this.getAllBusAssistants();
  }

  closeModal() {
    this.openedModal.hide();
  }

  openModal(modalDiv: any, type?: string, symptom?: any) {
    if (modalDiv) {
      this.openedModal = this.modalService.show(modalDiv, { class: "modal-dialog modal-dialog-centered" });
    }
    if (type === "update" && symptom) {
      this.selectedHealthSymptoms.setValue(symptom);
      this.updateHealthSymptomFormValues();
    }
  }
  getPhotoUrl(fileName: any): any {
    return fileName?.startsWith("http") ? fileName : this.assetsUrl + "/" + fileName;
  }
  updateHealthSymptomFormValues() {
    const data = this.selectedHealthSymptoms();
    if (data) {
      this.updateHealthSymptomsForm.patchValue({
        name: data.symptomName || "",
        profileImage: data.photo?.value || "",
      });
      this.profileImage = data.photo?.value?.startsWith("http") ? data.photo.value : environment.assetsUrl + "/" + data.photo?.value || "";
      // this.profileImage = data.profilePhoto?.value || "";
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (file.type !== "image/svg+xml") {
        this.alertService.error("Please select an SVG file. Other file formats are not supported.");
        input.value = ""; // Clear the file input
        return;
      }

      this.addHealthSymptomsForm.patchValue({ profileImage: file });
      this.updateHealthSymptomsForm.patchValue({ profileImage: file });
      const reader = new FileReader();
      reader.onload = e => {
        this.profileImage = e.target?.result as string;
        this.cdr.markForCheck(); // Manually trigger change detection
      };
      reader.readAsDataURL(file);
    }
  }
  addHealthSymptoms() {
    this.addHealthSymptomsForm.markAllAsTouched();
    if (this.addHealthSymptomsForm.invalid) return;
    if (this.addHealthSymptomsForm.valid) {
      const data = this.addHealthSymptomsForm.value;
      const payload: any = {
        symptomName: data.name,
        file: data.profileImage instanceof File ? data.profileImage : null,
      };
      const apiCall = this.healthService.addHealthSymptoms(payload, this.loader);
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall?.response && apiCall?.response?.status === "OK") {
            this.alertService.success(apiCall.response.message);
            this.closeCanvas.nativeElement.click();
            this.healthService.getAllHealthSymptoms();
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: (err: Error) => {
          this.alertService.error(err.message || "Failed to add health symptom. Please try again.");
        },
      });
    }
  }
  resetForm() {
    this.profileImage = "";
    this.addHealthSymptomsForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      profileImage: new FormControl<string | File | null>(null, [Validators.required]),
    });
  }
  updateHealthSymptoms() {
    this.updateHealthSymptomsForm.markAllAsTouched();

    if (this.updateHealthSymptomsForm.invalid) return;
    const id = this.selectedHealthSymptoms()?.id;
    if (this.updateHealthSymptomsForm.valid) {
      const data = this.updateHealthSymptomsForm.value;
      const payload: any = {
        id,
        symptomName: data.name,
        file: data.profileImage instanceof File ? data.profileImage : null,
      };
      const apiCall = this.healthService.updateHealthSymptoms(payload, this.loader);
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall?.response && apiCall?.response?.status === "OK") {
            this.alertService.success(apiCall.response.message);
            this.closeUpdateCanvas.nativeElement.click();
            this.updateHealthSymptomsForm.reset();
            this.healthService.getAllHealthSymptoms();
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: (err: Error) => {
          this.alertService.error(err.message || "Failed to update health symptom. Please try again.");
        },
      });
    }
  }
  deleteSymptoms() {
    const id = this.selectedHealthSymptoms()?.id;
    const apiCall = this.healthService.deleteHealthSymptoms(id, this.loader);
    apiCall.subject.subscribe({
      next: () => {
        if (apiCall?.response && apiCall?.response?.status === "OK") {
          this.closeModal();
          this.alertService.success(apiCall.response.message || "Health Symptom deleted successfully");
          this.healthService.getAllHealthSymptoms();
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: (err: Error) => {
        this.alertService.error(err.message || "Failed to delete health symptom");
      },
    });
  }
}
