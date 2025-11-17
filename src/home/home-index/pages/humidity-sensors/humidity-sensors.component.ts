/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertService, coreSignal, RequestLoader, RippleButtonDirective } from "@jot143/core-angular";
import { BsModalService } from "ngx-bootstrap/modal";
import { CampusService } from "../../../../app/services/campus.service";
import { HumidityService } from "../../../../app/services/humidity.service";
import { SingleSelectComponent } from "../../../components/single-select/single-select.component";
import { LoaderComponent } from "../loader/loader.component";
import { SubmitOnEnterDirective } from "../../../../app/shared/directives/submit-on-enter.directive";
import { InputComponent } from "../../../../app/ngx-components/input/input.component";
import { DataNotFoundComponent } from "../data-not-found/data-not-found.component";
import { environment } from "../../../../environments/environment";
import { Floor } from "../../../../app/model/Campus";
import { Humidity } from "../../../../app/model/Humidity";
import { MarkerMatrix } from "../../../../app/model/MarkerMatrix";
import { InteractiveMap, InteractiveMapComponent, InteractiveMapConfig, Marker } from "@jot143/core-interactive-map";

@Component({
  selector: "app-humidity-sensors",
  imports: [
    RippleButtonDirective,
    SingleSelectComponent,
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoaderComponent,
    SubmitOnEnterDirective,
    DataNotFoundComponent,
    InteractiveMapComponent,
  ],
  providers: [BsModalService],
  templateUrl: "./humidity-sensors.component.html",
  styleUrl: "./humidity-sensors.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HumiditySensorsComponent implements OnInit {
  @ViewChild("updateHumidityCanvas") updateHumidityCanvas!: ElementRef;
  @ViewChild("addHumidityCanvas") addHumidityCanvas!: ElementRef;
  @ViewChild("interactiveMapModal") interactiveMapModal!: any;

  modalService = inject(BsModalService);
  humidityService = inject(HumidityService);
  alertService = inject(AlertService);
  campusService = inject(CampusService);
  isSearchVisible = false;
  allSelected = coreSignal<boolean>(false);
  openedModal: any;
  selectedWatch: any = coreSignal([]);

  cdr = inject(ChangeDetectorRef);

  humidityForm = new FormGroup({
    macId: new FormControl("", Validators.required),
    latitude: new FormControl(""),
    longitude: new FormControl(""),
    campusId: new FormControl(""),
    buildingId: new FormControl(""),
    floorId: new FormControl("", Validators.required),
  });

  updateHumidityForm = new FormGroup({
    macId: new FormControl("", Validators.required),
    latitude: new FormControl(""),
    longitude: new FormControl(""),
    campusId: new FormControl(""),
    buildingId: new FormControl(""),
    floorId: new FormControl("", Validators.required),
  });

  campusForm = new FormGroup({
    campusId: new FormControl("", []),
    buildingId: new FormControl("", []),
    floorId: new FormControl("", []),
  });

  selectedCampus = coreSignal<any>(null);
  selectedBuilding = coreSignal<any>(null);
  selectedFloor = coreSignal<any>(null);
  selectedCampusFilter = coreSignal<any>(null);
  selectedBuildingFilter = coreSignal<any>(null);
  selectedFloorFilter = coreSignal<any>(null);
  humidityLoader = new RequestLoader();

  selectedHumidityForMap$ = coreSignal<Humidity | null>(null);
  selectedFloorForMap$ = coreSignal<Floor | null>(null);
  selectedMarker$ = coreSignal<MarkerMatrix | null>(null);

  // Interactive Map
  interactiveMap: InteractiveMap = new InteractiveMap();

  campusList: any = computed(() => [
    {
      label: "Select Campus",
      value: "",
    },
    ...this.campusService.campuses().map(campus => ({
      label: campus.name,
      value: campus.id,
    })),
  ]);
  buildingListFilter: any = computed(() => {
    const campus = this.selectedCampusFilter();
    if (!campus)
      return [
        {
          label: "Select Building",
          value: "",
        },
      ];
    return [
      {
        label: "Select Building",
        value: "",
      },
      ...(campus?.buildings?.map((building: any) => ({
        label: building.name,
        value: building.id,
      })) || []),
    ];
  });
  floorListFilter: any = computed(() => {
    const building = this.selectedBuildingFilter();
    if (!building)
      return [
        {
          label: "Select Floor",
          value: "",
        },
      ];
    return [
      {
        label: "Select Floor",
        value: "",
      },
      ...(building.floors?.map((floor: any) => ({
        label: floor.floorName,
        value: floor.id,
      })) || []),
    ];
  });
  buildingList: any = computed(() => {
    const campus = this.selectedCampus();
    if (!campus)
      return [
        {
          label: "Select Building",
          value: "",
        },
      ];
    return [
      {
        label: "Select Building",
        value: "",
      },
      ...(campus?.buildings?.map((building: any) => ({
        label: building.name,
        value: building.id,
      })) || []),
    ];
  });
  floorList: any = computed(() => {
    const building = this.selectedBuilding();
    if (!building)
      return [
        {
          label: "Select Floor",
          value: "",
        },
      ];
    return [
      {
        label: "Select Floor",
        value: "",
      },
      ...(building.floors?.map((floor: any) => ({
        label: floor.floorName,
        value: floor.id,
      })) || []),
    ];
  });
  loader = new RequestLoader();
  ngOnInit(): void {
    this.campusService.getAllCampuses();

    this.campusService.campuses.subject.subscribe(() => {
      if (this.campusService.campuses().length > 0) {
        const campus = this.campusService.campuses()[0];
        this.onCampusChange(campus.id);
        this.onCampusFilterChange(campus.id);
      }
    });

    this.selectedCampusFilter.subject.subscribe(() => {
      if (this.selectedCampusFilter()) {
        const building = this.selectedCampusFilter().buildings[0];
        this.onBuildingFilterChange(building?.id ?? null);
      } else {
        this.selectedBuildingFilter.setValue(null);
        this.selectedFloorFilter.setValue(null);
      }
    });

    this.selectedBuildingFilter.subject.subscribe(() => {
      if (this.selectedBuildingFilter()) {
        const floor = this.selectedBuildingFilter().floors[0];
        this.onFloorFilterChange(floor?.id ?? null);
      } else {
        this.selectedFloorFilter.setValue(null);
      }
    });

    this.selectedCampus.subject.subscribe(() => {
      if (this.selectedCampus()) {
        const building = this.selectedCampus().buildings[0];
        this.onBuildingChange(building?.id ?? null);
      } else {
        this.selectedBuilding.setValue(null);
        this.selectedFloor.setValue(null);
      }
    });

    this.selectedBuilding.subject.subscribe(() => {
      if (this.selectedBuilding()) {
        const floor = this.selectedBuilding().floors[0];
        this.onFloorChange(floor?.id ?? null);
      } else {
        this.selectedFloor.setValue(null);
      }
    });
  }

  resetAddForm() {
    this.humidityForm = new FormGroup({
      macId: new FormControl("", Validators.required),
      latitude: new FormControl(""),
      longitude: new FormControl(""),
      campusId: new FormControl(""),
      buildingId: new FormControl(""),
      floorId: new FormControl("", Validators.required),
    });
  }

  onCampusFilterChange(campusId: any) {
    if (campusId == "null" || campusId == null || campusId == undefined || campusId == "") {
      this.campusForm.patchValue({ campusId: "", buildingId: "", floorId: "" });
    } else {
      this.campusForm.patchValue({ campusId: campusId });
    }
    const campus: any = this.campusService.campuses().find(c => c.id === campusId);
    this.selectedCampusFilter.setValue(campus);
  }

  onBuildingFilterChange(buildingId: any) {
    if (buildingId == "null" || buildingId == null || buildingId == undefined || buildingId == "") {
      this.campusForm.patchValue({ buildingId: "", floorId: "" });
    } else {
      this.campusForm.patchValue({ buildingId: buildingId });
    }
    const building: any = this.selectedCampusFilter().buildings.find((b: any) => b.id === buildingId);
    this.selectedBuildingFilter.setValue(building);
  }

  onFloorFilterChange(floorId: any) {
    if (floorId == "null" || floorId == null || floorId == undefined || floorId == "") {
      this.campusForm.patchValue({ floorId: "" });
    } else {
      this.campusForm.patchValue({ floorId: floorId });
    }
    const floor: any = this.selectedBuildingFilter().floors.find((f: any) => f.id === floorId);
    this.selectedFloorFilter.setValue(floor);
    this.humidityService.getAllHumidity(this.humidityLoader, floorId);
  }

  onCampusChange(campusId: any) {
    if (campusId == "null" || campusId == null || campusId == undefined || campusId == "") {
      this.humidityForm.patchValue({ campusId: "", buildingId: "", floorId: "" });
      this.updateHumidityForm.patchValue({ campusId: "", buildingId: "", floorId: "" });
    } else {
      this.humidityForm.patchValue({ campusId: campusId });
      this.updateHumidityForm.patchValue({ campusId: campusId });
    }

    const campus: any = this.campusService.campuses().find(c => c.id === campusId);
    this.selectedCampus.setValue(campus);
  }

  onBuildingChange(buildingId: any) {
    if (buildingId == "null" || buildingId == null || buildingId == undefined || buildingId == "") {
      this.humidityForm.patchValue({ buildingId: "", floorId: "" });
      this.updateHumidityForm.patchValue({ buildingId: "", floorId: "" });
    } else {
      this.humidityForm.patchValue({ buildingId: buildingId });
      this.updateHumidityForm.patchValue({ buildingId: buildingId });
    }

    const building: any = this.selectedCampus().buildings.find((b: any) => b.id === buildingId);
    this.selectedBuilding.setValue(building);
  }

  onFloorChange(floorId: any) {
    if (floorId == "null" || floorId == null || floorId == undefined || floorId == "") {
      this.humidityForm.patchValue({ floorId: "" });
      this.updateHumidityForm.patchValue({ floorId: "" });
    } else {
      this.humidityForm.patchValue({ floorId: floorId });
      this.updateHumidityForm.patchValue({ floorId: floorId });
    }
    const floor: any = this.selectedBuilding().floors.find((f: any) => f.id === floorId);
    this.selectedFloor.setValue(floor);
  }

  toggleSelection(event: Event, humidityItem?: any) {
    const isChecked = (event.target as HTMLInputElement).checked;

    // Case: clicked on a single row checkbox
    if (humidityItem) {
      const updatedHumidity = this.humidityService.humidity().map((humidity: any) => {
        if (String(humidity.macId) === String(humidityItem.macId)) {
          humidity.selected = isChecked;
        }
        return humidity;
      });
      this.humidityService.humidity.setValue(updatedHumidity);
    } else {
      // Case: clicked on the master checkbox
      const updatedHumidity = this.humidityService.humidity().map((humidity: any) => {
        humidity.selected = isChecked;
        return humidity;
      });
      this.humidityService.humidity.setValue(updatedHumidity);
    }

    // Update allSelected based on current state
    this.allSelected.setValue(this.humidityService.humidity().every((humidity: any) => humidity.selected));
  }

  closeModal() {
    this.openedModal.hide();
  }

  openModal(modalDiv: any, type?: string, watch?: any) {
    this.openedModal = this.modalService.show(modalDiv, { class: "modal-dialog modal-dialog-centered" });
    if (type === "update") {
      this.selectedWatch.setValue(watch);
      this.updateWatchFormValues();
    }
  }

  updateWatchFormValues() {
    const student = this.selectedWatch();

    if (student) {
      this.updateHumidityForm.patchValue({
        macId: student.macId,
        latitude: student.latitude,
        longitude: student.longitude,
        floorId: student.floorId,
        campusId: student.campusId,
        buildingId: student.buildingId,
      });
    }
  }

  addHumiditySensor() {
    this.humidityForm.markAllAsTouched();
    if (this.humidityForm.valid) {
      const data = this.humidityForm.value;
      const payload: any = {
        macId: data.macId,
        latitude: data.latitude,
        longitude: data.longitude,
        // campusId: data.campusId || "",
        // buildingId: data.buildingId || "",
        floorId: data.floorId || "",
      };
      const apiCall = this.humidityService.addHumidity(payload, this.loader);
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall?.response && apiCall?.response?.status === "OK") {
            this.alertService.success(apiCall.response.message);
            this.humidityService.getAllHumidity();
            this.addHumidityCanvas.nativeElement.click();
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: () => {
          this.alertService.error("Something went wrong. Please try again.");
        },
      });
    } else {
      this.alertService.error("Please fill in all required fields correctly");
    }
  }

  updateHumiditySensor() {
    this.updateHumidityForm.markAllAsTouched();
    if (this.updateHumidityForm.valid) {
      const data = this.updateHumidityForm.value;
      const payload: any = {
        id: this.selectedWatch()?.id,
        macId: data.macId,
        latitude: data.latitude,
        longitude: data.longitude,
        // campusId: data.campusId || "",
        // buildingId: data.buildingId || "",
        floorId: data.floorId || "",
      };
      const apiCall = this.humidityService.updateHumidity(payload, this.loader);
      apiCall.subject.subscribe({
        next: () => {
          if (apiCall?.response && apiCall?.response?.status === "OK") {
            this.alertService.success(apiCall.response.message);
            this.humidityService.getAllHumidity();
            this.updateHumidityCanvas.nativeElement.click();
          } else {
            this.alertService.error(apiCall.response.message || "Something went wrong");
          }
        },
        error: () => {
          this.alertService.error("Something went wrong. Please try again.");
        },
      });
    } else {
      this.alertService.error("Please fill in all required fields correctly");
    }
  }

  deleteHumiditySensor() {
    const id = this.selectedWatch()?.id;
    const apiCall = this.humidityService.deleteHumidity(id, this.loader);
    apiCall.subject.subscribe({
      next: () => {
        if (apiCall?.response && apiCall?.response?.status === "OK") {
          this.alertService.success(apiCall.response.message);
          // this.alertService.success("Humidity Sensor deleted successfully");
          this.closeModal();
          this.humidityService.getAllHumidity();
        } else {
          this.alertService.error(apiCall.response.message || "Something went wrong");
        }
      },
      error: (err: Error) => {
        this.alertService.error(err.message);
      },
    });
  }

  getFloorMapImageUrl(imageValue: string): string {
    if (!imageValue) {
      return "";
    }
    return imageValue.startsWith("http") ? imageValue : environment.assetsUrl + "/" + imageValue;
  }

  // Interactive Map Modal Methods
  openInteractiveMapModal(humidity: any) {
    this.selectedHumidityForMap$.setValue({ ...humidity });
    this.selectedFloorForMap$.setValue({ ...humidity.floor });

    this.openedModal = this.modalService.show(this.interactiveMapModal, {
      class: "modal-dialog modal-dialog-centered modal-xl",
      backdrop: "static",
      keyboard: false,
    });

    // Ensure the modal is properly opened before trying to access the component
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  onInteractiveMapLoad(interactiveMapComponent: InteractiveMapComponent) {
    this.initializeInteractiveMap(interactiveMapComponent);
  }

  private async initializeInteractiveMap(interactiveMapComponent: InteractiveMapComponent) {
    const humidity = this.selectedHumidityForMap$();
    if (!humidity || !humidity.floor?.floorMapPhoto?.value) {
      console.warn("No classroom data or floor map photo available");
      return;
    }

    const floorMapImageUrl = this.getFloorMapImageUrl(humidity.floor.floorMapPhoto.value);

    const config: InteractiveMapConfig = {
      imageMapUrl: floorMapImageUrl,
      editingMode: false, // FULL editing
    };

    // Load existing geometry
    const floorMapGeometry = humidity.floor?.floorMapGeometry;
    if (floorMapGeometry) {
      if (floorMapGeometry.calibration && floorMapGeometry.calibration.isCalibrated) {
        config.calibration = floorMapGeometry.calibration;
      }
      if (floorMapGeometry.markers) {
        config.markers = floorMapGeometry.markers;
      }
      if (floorMapGeometry.polygons) {
        config.polygons = floorMapGeometry.polygons;
      }
    }

    try {
      this.interactiveMap.init(interactiveMapComponent, config);

      // load the polygon from the backend
      const classRoom = this.selectedHumidityForMap$()?.classRoom;
      if (classRoom) {
        const polygonRaw = classRoom.roomGeometry;
        if (polygonRaw) {
          this.interactiveMap.addPolygonFromJson(polygonRaw);
          this.interactiveMap.render();
        }
      }

      const humidity = this.selectedHumidityForMap$();
      console.log(humidity);
      if (humidity && humidity.markerMatrix) {
        const marker = this.interactiveMap.addMarkerFromJson(humidity.markerMatrix);
        const markerMatrix = await MarkerMatrix.create<MarkerMatrix>(marker.toJson());
        this.selectedMarker$.setValue(markerMatrix);
        this.interactiveMap.render();
      }
    } catch (error) {
      console.error("Error initializing interactive map:", error);
      this.alertService.error("Failed to initialize interactive map. Please try again.");
    }
  }

  async onMarkerDrawFinish(marker: Marker) {
    const markerMatrix = await MarkerMatrix.create<MarkerMatrix>(marker.toJson());
    this.selectedMarker$.setValue(markerMatrix);

    const humidity = this.selectedHumidityForMap$();
    if (humidity) {
      humidity.markerMatrix = markerMatrix;
      this.selectedHumidityForMap$.setValue(humidity);
    }
  }

  createMarker() {
    this.interactiveMap.startDrawMarker({
      title: `Humidity Sensor`,
      description: `Humidity Sensor ${this.selectedHumidityForMap$()?.macId}`,
      draggable: false,
      iconUrl: "/icons/humidity-sensor.png",
      size: 32,
    });

    this.interactiveMap.render();
  }

  editMarker() {
    this.interactiveMap.openMarkerSidebar();
    this.interactiveMap.render();
  }

  deleteMarker() {
    const humidity = this.selectedHumidityForMap$();
    if (humidity) {
      const marker = this.selectedMarker$();
      if (marker && marker.id) {
        this.interactiveMap.removeMarker(marker.id);
        this.interactiveMap.render();
      }

      humidity.latitude = "";
      humidity.longitude = "";
      humidity.markerMatrix = null;
      this.selectedHumidityForMap$.setValue(humidity);
      this.selectedMarker$.setValue(null);
    }
  }

  // Save the current map geometry to the backend
  saveMapChanges() {
    const humidity = this.selectedHumidityForMap$();
    if (!humidity) {
      this.alertService.error("No humidity sensor selected.");
      return;
    }
    try {
      const marker = this.selectedMarker$();
      const markerMatrix = {
        latitude: marker?.latitude,
        longitude: marker?.longitude,
        title: marker?.title,
        description: marker?.description,
        iconUrl: marker?.iconUrl,
        draggable: marker?.draggable,
        size: marker?.size,
        x: marker?.x,
        y: marker?.y,
        id: marker?.id,
      };

      const humidityPayload = {
        id: humidity.id,
        markerMatrix: markerMatrix,
      };

      console.log(humidityPayload);

      const apiCall = this.humidityService.updateHumidityMarkerMatrix(humidityPayload, this.loader);
      apiCall.subject.subscribe({
        next: (res: any) => {
          if (res?.response?.status === "OK") {
            this.alertService.success(res.response.message);
          } else {
            this.alertService.error(res.response.message || "Something went wrong");
          }
        },
        error: () => {
          this.alertService.error("Failed to save map changes.");
        },
      });
    } catch {
      this.alertService.error("Failed to get map geometry.");
    }
  }
}
