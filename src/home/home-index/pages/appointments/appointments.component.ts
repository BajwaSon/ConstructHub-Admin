/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, coreSignal, RequestLoader, RippleButtonDirective } from "@jot143/core-angular";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ProfilePhotoDirective } from "../../../../app/directives/profile-photo.directive";
import { AvatarService } from "../../../../app/services/avatar.service";
import { DepartmentService } from "../../../../app/services/department.service";
import { TeacherService } from "../../../../app/services/teacher.service";
import { SubmitOnEnterDirective } from "../../../../app/shared/directives/submit-on-enter.directive";
import { MultiSelectComponent } from "../../../components/multi-select/multi-select.component";
import { SingleSelectComponent } from "../../../components/single-select/single-select.component";
import { DepartmentFilterPipe } from "../../pipes/department-filter.pipe";
import { DataNotFoundComponent } from "../data-not-found/data-not-found.component";
import { LoaderComponent } from "../loader/loader.component";

// import { InputComponent } from "../../../../app/ngx-components/input/input.component";

@Component({
  selector: "app-appointments",
  imports: [
    RippleButtonDirective,
    ReactiveFormsModule,
    CommonModule,
    MultiSelectComponent,
    FormsModule,
    DepartmentFilterPipe,
    FormsModule,
    LoaderComponent,
    DataNotFoundComponent,
    ProfilePhotoDirective,
    SubmitOnEnterDirective,
    SingleSelectComponent,
  ],
  providers: [BsModalService],
  templateUrl: "./appointments.component.html",
  styleUrl: "./appointments.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsComponent implements OnInit {
  // inject services
  private alertService = inject(AlertService);
  teacherService = inject(TeacherService);
  modalService = inject(BsModalService);
  departmentService = inject(DepartmentService);
  avatarService = inject(AvatarService);

  isSearchVisible = false;
  selectedDepartment = coreSignal<any>([]);

  addDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });
  addStaffForm = new FormGroup({
    role: new FormControl<string>("", [Validators.required]),
    name: new FormControl<string>("", [Validators.required]),
  });

  updateDepartmentForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
  });

  openedModal!: BsModalRef;
  activeIndex: number = 0;
  selectedTeachers = coreSignal<any[]>([]);
  teachers = coreSignal<any[]>([]);
  selectedStaffRole = coreSignal<string>("teacher"); // Default to Teacher role
  selectedRoleSignal = coreSignal<string>("teacher"); // New signal to track selected role
  patientLists = [
    { label: "Patient 1", value: "Patient 1" },
    { label: "Patient 2", value: "Patient 2" },
    { label: "Patient 3", value: "Patient 3" },
  ];

  caseLists = [
    { label: "Case 1", value: "Case 1" },
    { label: "Case 2", value: "Case 2" },
    { label: "Case 3", value: "Case 3" },
  ];

  dateLists = [
    { label: "Date 1", value: "Date 1" },
    { label: "Date 2", value: "Date 2" },
    { label: "Date 3", value: "Date 3" },
  ];

  timeLists = [
    { label: "Time 1", value: "Time 1" },
    { label: "Time 2", value: "Time 2" },
    { label: "Time 3", value: "Time 3" },
  ];
  roleList = computed(() => [
    {
      label: "Select Role",
      value: "",
    },
    { label: "Teacher", value: "teacher" },
    { label: "Nurse", value: "nurse" },
    { label: "Bus Assistant", value: "busAssistant" },
    { label: "Staff", value: "staff" },
  ]);

  classNames = [
    { label: "Class 1", value: "Class 1" },
    { label: "Class 2", value: "Class 2" },
    { label: "Class 3", value: "Class 3" },
  ];

  levelLists = [
    { label: "Level 1", value: "Level 1" },
    { label: "Level 2", value: "Level 2" },
    { label: "Level 3", value: "Level 3" },
  ];

  doctorLists = [
    { label: "Department 1", value: "Department 1" },
    { label: "Department 2", value: "Department 2" },
    { label: "Department 3", value: "Department 3" },
  ];

  searchTerm: string = "";
  departmentLoader = new RequestLoader();
  loader = new RequestLoader();
  teachersOptions = computed(() => {
    const selectedDeptUsers = this.selectedDepartment()?.users || [];
    const selectedDeptUserIds = selectedDeptUsers.map((user: any) => user.id);
    const selectedRole = this.selectedRoleSignal();
    let staffList: any[] = [];

    // Get staff based on selected role
    switch (selectedRole) {
      case "teacher": // Teacher
        staffList = this.teacherService.teacherRoles();
        break;
      case "nurse": // Nurse
        staffList = this.teacherService.nurseRoles();
        break;
      case "busAssistant": // Bus Assistant
        staffList = this.teacherService.busAssistantRoles();
        break;
      case "staff": // Staff
        staffList = this.teacherService.staffRoles();
        break;
      default:
        staffList = this.teacherService.teacherRoles();
    }

    const filteredStaff = staffList
      .filter((staff: any) => !selectedDeptUserIds.includes(staff.id))
      .map((staff: any) => ({
        label: `${staff.profile.firstName} ${staff.profile.middleName} ${staff.profile.lastName}`,
        value: staff.id as string,
      }));

    return filteredStaff;
  });
  staffWithRoles = computed(() => {
    return [...this.teacherService.teacherRoles(), ...this.teacherService.nurseRoles(), ...this.teacherService.busAssistantRoles(), ...this.teacherService.staffRoles()];
  });

  ngOnInit(): void {
    this.getDepartments();
    this.getTeachers();
    this.teacherService.getAllStaffWithRoles();
    this.departmentService.departments.subject.subscribe((departments: any) => {
      const current = this.selectedDepartment();
      const selectedDepartment = departments.find((d: any) => d.id === current?.id);
      if (!selectedDepartment && departments.length > 0) {
        this.selectedDepartment.setValue(departments[0]);
      } else if (selectedDepartment) {
        this.selectedDepartment.setValue(selectedDepartment);
      }
    });
  }

  getDepartments() {
    this.departmentService.getDepartments(this.departmentLoader);
  }
  addSelectedTeachers(staff: any) {
    this.addStaffForm.patchValue({ name: staff });
    const selectedTeacher = staff;
    this.selectedTeachers.setValue(selectedTeacher);
  }
  getTeachers() {
    this.teacherService.getAllTeachers();
  }

  closeModal() {
    this.openedModal.hide();
  }

  onStaffRoleChange(selectedLevel: any, type?: string) {
    const value = typeof selectedLevel === "object" ? selectedLevel.value : selectedLevel;
    this.addStaffForm.patchValue({ role: value });
    this.selectedRoleSignal.setValue(value);
    if (type === "staffRole") {
      if (this.addStaffForm.value.role === "") {
        this.addStaffForm.patchValue({ name: "" });
      }
    }
  }
  applyHODBadge() {
    if (!this.selectedTeachers() || this.selectedTeachers().length === 0) {
      this.alertService.error("Please select a staff member to apply HOD badge");
      return;
    }

    const payload: any = {
      department_id: this.selectedDepartment().id,
      staff_id: this.selectedTeachers()[0]?.value,
    };

    const apiCall = this.departmentService.makeHod(payload, this.loader);
    apiCall.subject.subscribe({
      next: () => {
        this.alertService.success("HOD Badge applied successfully");
        this.closeModal();
        this.departmentService.getDepartments();
        this.getTeachers();
      },
      error: (err: Error) => {
        this.alertService.error(err.message);
      },
    });
  }
  setActive(index: number, dept: any): void {
    this.activeIndex = index;
    this.selectedDepartment.setValue(dept);
  }
  openModal(modalDiv: any, dept?: any, user?: any) {
    this.openedModal = this.modalService.show(modalDiv, { class: "modal-dialog modal-dialog-centered modal-xl" });
    if (dept === "addDepartmentModalStaff") {
      this.addStaffForm = new FormGroup({
        role: new FormControl<string>("", [Validators.required]),
        name: new FormControl<string>("", [Validators.required]),
      });
      // Reset selected staff role to default (Teacher)
      this.selectedStaffRole.setValue("teacher");
      this.selectedRoleSignal.setValue("teacher"); // Reset the signal
      this.selectedTeachers.setValue([]);
    }
    if (dept === "updateDepartment") {
      this.updateDepartmentForm.setValue({ name: this.selectedDepartment().name });
    }
    if (dept === "unassignDepartment") {
      this.selectedTeachers.setValue([{ label: user.name, value: user.id }]);
    }
  }
  resetAddForm() {
    this.addDepartmentForm = new FormGroup({
      name: new FormControl<string>("", [Validators.required]),
    });
  }
  addDepartment() {
    this.addDepartmentForm.markAllAsTouched();
    if (this.addDepartmentForm.invalid) {
      // this.alertService.error("Please fill in all required fields correctly");
      return;
    }

    const payload: any = {
      name: this.addDepartmentForm.value.name,
    };
    const apiCall = this.departmentService.addDepartment(payload, this.loader);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status == "OK") {
          this.closeModal();
          this.departmentService.getDepartments().subject.subscribe({
            next: async () => {
              const departments = this.departmentService.departments();
              // Find the newly added department (by name or id)
              const newIndex = departments.findIndex(dep => dep.name === this.addDepartmentForm.value.name);
              if (newIndex !== -1) {
                this.setActive(newIndex, departments[newIndex]);
              }
            },
          });
          this.alertService.success(apiCall.response.message);
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async (err: Error) => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });
  }
  updateDepartment() {
    this.updateDepartmentForm.markAllAsTouched();
    if (this.updateDepartmentForm.invalid) {
      // this.alertService.error("Please fill in all required fields correctly");
      return;
    }

    const payload: any = {
      id: this.selectedDepartment().id,
      name: this.updateDepartmentForm.value.name,
    };
    const apiCall = this.departmentService.updateDepartment(payload, this.loader);
    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status == "OK") {
          this.closeModal();
          this.departmentService.getDepartments();
          this.alertService.success(apiCall.response.message);
        } else {
          this.alertService.error(apiCall.response.message ?? "Something went wrong");
        }
      },
      error: async (err: Error) => {
        this.alertService.error(err.message);
      },
    });
  }
  assignStaff() {
    this.addStaffForm.markAllAsTouched();
    if (this.addStaffForm.invalid) {
      // this.alertService.error("Please fill in all required fields correctly");
      return;
    } else if (!this.selectedTeachers() || this.selectedTeachers().length === 0) {
      this.alertService.error("Please select a staff member to assign");
      return;
    }
    if (this.addStaffForm.valid) {
      const payload: any = {
        department_id: this.selectedDepartment().id,
        staff_id: this.selectedTeachers().map((teacher: any) => teacher.value),
      };

      const apiCall = this.departmentService.assignTeacher(payload, this.loader);
      apiCall.subject.subscribe({
        next: async () => {
          if (apiCall.response?.status == "OK") {
            this.closeModal();
            this.addStaffForm.reset();
            this.departmentService.getDepartments();
            this.alertService.success(apiCall.response.message);
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: async (err: Error) => {
          this.alertService.error(err.message || "Something went wrong");
        },
      });
    } else {
      this.alertService.error("Please enter all required fields.");
    }
  }
  unassignDepartment() {
    const payload: any = {
      department_id: this.selectedDepartment().id,
      staff_id: this.selectedTeachers().map((teacher: any) => teacher.value),
    };
    const apiCall = this.departmentService.unassignTeacher(payload, this.loader);

    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status == "OK") {
          this.closeModal();
          this.departmentService.getDepartments();
          this.alertService.success(apiCall.response.message);
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async (err: Error) => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });
  }

  deleteDepartment() {
    const payload: any = {
      id: this.selectedDepartment().id,
    };
    const apiCall = this.departmentService.deleteDepartment(payload, this.loader);

    apiCall.subject.subscribe({
      next: async () => {
        if (apiCall.response?.status == "OK") {
          this.alertService.success(apiCall.response.message);
          this.closeModal();
          this.departmentService.getDepartments().subject.subscribe({
            next: async () => {
              const departments = this.departmentService.departments();
              if (departments.length > 0) {
                this.setActive(0, departments[0]);
              } else {
                this.activeIndex = -1;
                this.selectedDepartment.setValue(null);
              }
            },
          });
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: async (err: Error) => {
        this.alertService.error(err.message || "Something went wrong");
      },
    });
  }
}
