/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { coreSignal, RequestLoader, RippleButtonDirective } from "@jot143/core-angular";
import { AvatarService } from "../../../../../app/services/avatar.service";
import { HealthService } from "../../../../../app/services/child/health.service";
import { ClassByLevelSchedulingService } from "../../../../../app/services/class-by-level-scheduling.service";
import { ClassSectionService } from "../../../../../app/services/class-section.service";
import { CreateSectionService } from "../../../../../app/services/create-section.service";
// import { CampusService } from "../../../../../app/services/campus.service";
import { SingleSelectComponent } from "../../../../components/single-select/single-select.component";
import { NumberFormatPipe } from "./number-format.pipe";
interface Dot {
  id: number;
  x: number;
  y: number;
  isTeacher: boolean;
  isStaff: boolean;
  targetX: number;
  targetY: number;
}

@Component({
  selector: "app-live-tracking",
  imports: [CommonModule, RippleButtonDirective, NumberFormatPipe, SingleSelectComponent, FormsModule, ReactiveFormsModule],
  templateUrl: "./live-tracking.component.html",
  styleUrl: "./live-tracking.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveTrackingComponent implements OnInit, OnDestroy {
  @ViewChildren("tabButtons") tabButtons!: QueryList<ElementRef>;
  activeTabIndex = 0;
  selectedCampusFilter = coreSignal<any>(null);
  selectedBuildingFilter = coreSignal<any>(null);
  selectedFloorFilter = coreSignal<any>(null);
  // Static demo data: Terminals → Airlines → Gates
  staticCampuses = [
    {
      id: "t1",
      name: "Site Office",
      buildings: [
        {
          id: "ek",
          name: "Foundation Zone",
          floors: [
            { id: "a1", floorName: "Office Entrance" },
            { id: "a3", floorName: "Staff Entrance" },
            { id: "a4", floorName: "Main Entrance" },
          ],
        },
        {
          id: "qr",
          name: "Structural Zone",
          floors: [
            { id: "b1", floorName: "Zone Ground" },
            { id: "b2", floorName: "Zone Main" },
          ],
        },
      ],
    },
    {
      id: "t2",
      name: "Material Storage",
      buildings: [
        {
          id: "ey",
          name: "Warehouse Zone",
          floors: [
            { id: "c1", floorName: "Warehouse Ground" },
            { id: "c3", floorName: "Warehouse Main" },
          ],
        },
        {
          id: "ba",
          name: "Material Handling",
          floors: [
            { id: "d4", floorName: "Material House" },
            { id: "d6", floorName: "Material Main" },
          ],
        },
      ],
    },
    {
      id: "t3",
      name: "Parking Area",
      buildings: [
        {
          id: "lh",
          name: "Parking Area Building",
          floors: [
            { id: "e1", floorName: "Parking Entrance" },
            { id: "e2", floorName: "Parking Main" },
            { id: "e5", floorName: "Parking Exit" },
          ],
        },
      ],
    },
  ];
  // Static independent Airlines list (not dependent on Terminal/Gate)
  staticAirlines = [
    { id: "ek", name: "Foundation Zone" },
    { id: "qr", name: "Structural Zone" },
    { id: "ey", name: "Warehouse Zone" },
    { id: "ba", name: "Materials Zone" },
    { id: "lh", name: "Parking Zone" },
  ];
  campusList: any = computed(() => [
    {
      label: "Select Site",
      value: "",
    },
    ...this.staticCampuses.map(campus => ({
      label: campus.name,
      value: campus.id,
    })),
  ]);
  // Airlines: independent static list
  buildingListFilter: any = computed(() => [
    {
      label: "Select Zone",
      value: "",
    },
    ...this.staticAirlines.map(a => ({ label: a.name, value: a.id })),
  ]);
  // Gates: independent list aggregated from all terminals
  floorListFilter: any = computed(() => {
    const allFloors = this.staticCampuses.flatMap((c: any) => c.buildings || []).flatMap((b: any) => b.floors || []);
    return [{ label: "Select Area", value: "" }, ...allFloors.map((floor: any) => ({ label: floor.floorName, value: floor.id }))];
  });
  tabs = [
    {
      label: "Live Tracking",
      // icon: `<i class='bx bx-devices' ></i>`,
    },
    {
      label: "Filter Role",
      // icon: `<i class='bx bx-hive' ></i>`,
    },
  ];

  // Flight number dropdown options for Filter By tab
  flightNumberList = computed(() => {
    const uniqueFlightNos = Array.from(new Set(this.allSchoolData.map(p => p.flightNo)));
    return [{ label: "Select Worker", value: "" }, ...uniqueFlightNos.map(no => ({ label: no, value: no }))];
  });
  selectedFlightNo = coreSignal<string>("");

  // Flight ID dropdown (dummy data)
  flightIdOptions = [
    { label: "Select Role", value: "" },
    { label: "Workers", value: "Workers" },
    { label: "Foreman", value: "Foreman" },
    { label: "Security Officers", value: "Security Officers" },
    { label: "Staffs", value: "Staffs" },
    { label: "Supervisors", value: "Supervisors" },
    { label: "Directors", value: "Directors" },
  ];
  selectedFlightId = coreSignal<string>("");

  levelList = computed(() => [
    {
      label: "Select Level",
      value: "",
    },
    ...this.classLevelService.classLevels().map(level => ({
      label: level.levelName,
      value: level.id,
    })),
  ]);

  // Get passengers for selected flight ID
  filteredPassengers = computed(() => {
    const selectedId = this.selectedFlightId();
    if (!selectedId) return [];

    return this.allSchoolData.filter(passenger => {
      const flightIdMapping: { [key: string]: string[] } = {
        "Worker 1": ["Worker 1"],
        "Worker 2": ["Worker 2"],
        "Worker 3": ["Worker 3"],
        "Worker 4": ["Worker 4"],
        "Worker 5": ["Worker 5"],
      };

      const flightNumbers = flightIdMapping[selectedId] || [];
      return flightNumbers.includes(passenger.flightNo);
    });
  });

  classNameList = computed(() => [
    {
      label: "Select Class",
      value: "",
    },
    ...this.classSectionService.classSectionsByClassLevel().map(section => ({
      label: section.classSectionName,
      value: section.id,
    })),
  ]);

  campusForm = new FormGroup({
    campusId: new FormControl("", []),
    buildingId: new FormControl("", []),
    floorId: new FormControl("", []),
  });
  private tabInterval: ReturnType<typeof setInterval> | undefined;
  classLevelLoader = new RequestLoader();
  classSectionLoader = new RequestLoader();
  arrivals: any[] = [];
  activeDots: Dot[] = [];
  intervalId: any;
  counter = 1;
  maxItems = 50;
  activeStudent: any = [];
  staffCount = 0;
  teacherCount = 0;
  childrenCount = 0;
  allSchoolData = [
    {
      id: 1,
      airline: "ABC Construction",
      passengerName: "Ahmed Hassan",
      flightNo: "WRK-1234",
      destination: "Foundation Zone",
      profile: "https://i.pravatar.cc/150?img=1",
      designation: "Foreman",
    },
    {
      id: 2,
      airline: "XYZ Builders",
      passengerName: "Sarah Johnson",
      flightNo: "WRK-5678",
      destination: "Structural Zone",
      profile: "https://i.pravatar.cc/150?img=2",
      designation: "Engineer",
    },
    {
      id: 3,
      airline: "Metro Construction",
      passengerName: "Mohammed Ali",
      flightNo: "WRK-9012",
      destination: "Electrical Zone",
      profile: "https://i.pravatar.cc/150?img=3",
      designation: "Electrician",
    },
    {
      id: 4,
      airline: "Prime Builders",
      passengerName: "Emma Wilson",
      flightNo: "WRK-3456",
      destination: "Plumbing Zone",
      profile: "https://i.pravatar.cc/150?img=4",
      designation: "Plumber",
    },
    {
      id: 5,
      airline: "Elite Construction",
      passengerName: "Hans Mueller",
      flightNo: "WRK-7890",
      destination: "HVAC Zone",
      profile: "https://i.pravatar.cc/150?img=5",
      designation: "HVAC Technician",
    },
    {
      id: 6,
      airline: "Global Builders",
      passengerName: "Marie Dubois",
      flightNo: "WRK-2345",
      destination: "Finishing Zone",
      profile: "https://i.pravatar.cc/150?img=6",
      designation: "Worker",
    },
    {
      id: 7,
      airline: "XYZ Builders",
      passengerName: "Fatima Al-Zahra",
      flightNo: "WRK-6789",
      destination: "Structural Zone",
      profile: "https://i.pravatar.cc/150?img=7",
      designation: "Worker",
    },
    {
      id: 8,
      airline: "Metro Construction",
      passengerName: "Abdullah Rahman",
      flightNo: "WRK-0123",
      destination: "Electrical Zone",
      profile: "https://i.pravatar.cc/150?img=8",
      designation: "Electrician",
    },
    {
      id: 9,
      airline: "Prime Builders",
      passengerName: "James Thompson",
      flightNo: "WRK-4567",
      destination: "Plumbing Zone",
      profile: "https://i.pravatar.cc/150?img=9",
      designation: "Plumber",
    },
    {
      id: 10,
      airline: "Elite Construction",
      passengerName: "Anna Schmidt",
      flightNo: "WRK-8901",
      destination: "HVAC Zone",
      profile: "https://i.pravatar.cc/150?img=10",
      designation: "HVAC Technician",
    },
    {
      id: 11,
      airline: "ABC Construction",
      passengerName: "Zeynep Kaya",
      flightNo: "WRK-2345",
      destination: "Foundation Zone",
      profile: "https://i.pravatar.cc/150?img=11",
      designation: "Worker",
    },
    {
      id: 12,
      airline: "Desert Builders",
      passengerName: "Omar Al-Sayed",
      flightNo: "WRK-6789",
      destination: "Site Office",
      profile: "https://i.pravatar.cc/150?img=12",
      designation: "Staff",
    },
    {
      id: 13,
      airline: "Jordan Construction",
      passengerName: "Layla Al-Hashimi",
      flightNo: "WRK-0123",
      destination: "Material Storage",
      profile: "https://i.pravatar.cc/150?img=13",
      designation: "Material Handler",
    },
    {
      id: 14,
      airline: "Gulf Builders",
      passengerName: "Khalid Al-Mansouri",
      flightNo: "WRK-4567",
      destination: "Parking Area",
      profile: "https://i.pravatar.cc/150?img=14",
      designation: "Security",
    },
    {
      id: 15,
      airline: "European Construction",
      passengerName: "Pierre Moreau",
      flightNo: "WRK-8901",
      destination: "Finishing Zone",
      profile: "https://i.pravatar.cc/150?img=15",
      designation: "Supervisor",
    },
    {
      id: 16,
      airline: "Asia Pacific Builders",
      passengerName: "Priya Patel",
      flightNo: "WRK-2345",
      destination: "Concrete Works",
      profile: "https://i.pravatar.cc/150?img=16",
      designation: "Concrete Worker",
    },
    {
      id: 17,
      airline: "Oman Construction",
      passengerName: "Salim Al-Rashidi",
      flightNo: "WRK-6789",
      destination: "Steel Works",
      profile: "https://i.pravatar.cc/150?img=17",
      designation: "Steel Worker",
    },
    {
      id: 18,
      airline: "South Asia Builders",
      passengerName: "Aisha Khan",
      flightNo: "WRK-0123",
      destination: "Masonry Zone",
      profile: "https://i.pravatar.cc/150?img=18",
      designation: "Mason",
    },
    {
      id: 19,
      airline: "Island Construction",
      passengerName: "Rajith Perera",
      flightNo: "WRK-4567",
      destination: "Roofing Zone",
      profile: "https://i.pravatar.cc/150?img=19",
      designation: "Roofer",
    },
    {
      id: 20,
      airline: "Pacific Builders",
      passengerName: "Li Wei Chen",
      flightNo: "WRK-8901",
      destination: "Landscaping",
      profile: "https://i.pravatar.cc/150?img=20",
      designation: "Landscaper",
    },
    {
      id: 21,
      airline: "Malaysia Construction",
      passengerName: "Ahmad bin Ismail",
      flightNo: "WRK-2345",
      destination: "Tiling Zone",
      profile: "https://i.pravatar.cc/150?img=21",
      designation: "Tile Installer",
    },
    {
      id: 22,
      airline: "Archipelago Builders",
      passengerName: "Siti Nurhaliza",
      flightNo: "WRK-6789",
      destination: "Painting Zone",
      profile: "https://i.pravatar.cc/150?img=22",
      designation: "Painter",
    },
    {
      id: 23,
      airline: "Island Pacific Builders",
      passengerName: "Maria Santos",
      flightNo: "WRK-0123",
      destination: "Carpentry Zone",
      profile: "https://i.pravatar.cc/150?img=23",
      designation: "Carpenter",
    },
    {
      id: 24,
      airline: "Desert Builders",
      passengerName: "Fahad Al-Qahtani",
      flightNo: "WRK-4567",
      destination: "Site Office",
      profile: "https://i.pravatar.cc/150?img=24",
      designation: "Staff",
    },
    {
      id: 25,
      airline: "East Asia Construction",
      passengerName: "Yuki Tanaka",
      flightNo: "WRK-8901",
      destination: "Quality Control",
      profile: "https://i.pravatar.cc/150?img=25",
      designation: "Quality Inspector",
    },
    {
      id: 26,
      airline: "Korean Builders",
      passengerName: "Min-ji Kim",
      flightNo: "WRK-2345",
      destination: "Safety Zone",
      profile: "https://i.pravatar.cc/150?img=26",
      designation: "Safety Officer",
    },
    {
      id: 27,
      airline: "Greater China Construction",
      passengerName: "Xiao Ming",
      flightNo: "WRK-6789",
      destination: "Inspection Area",
      profile: "https://i.pravatar.cc/150?img=27",
      designation: "Inspector",
    },
    {
      id: 28,
      airline: "Southeast Builders",
      passengerName: "Somchai Srisai",
      flightNo: "WRK-0123",
      destination: "Material Handling",
      profile: "https://i.pravatar.cc/150?img=28",
      designation: "Material Handler",
    },
    {
      id: 29,
      airline: "Indochina Construction",
      passengerName: "Nguyen Van Minh",
      flightNo: "WRK-4567",
      destination: "Equipment Zone",
      profile: "https://i.pravatar.cc/150?img=29",
      designation: "Equipment Operator",
    },
    {
      id: 30,
      airline: "Desert Builders",
      passengerName: "Abdulrahman Al-Zahrani",
      flightNo: "WRK-8901",
      destination: "Site Office",
      profile: "https://i.pravatar.cc/150?img=30",
      designation: "Site Manager",
    },
    {
      id: 31,
      airline: "North America Builders",
      passengerName: "Michael Brown",
      flightNo: "WRK-2345",
      destination: "Waste Management",
      profile: "https://i.pravatar.cc/150?img=31",
      designation: "Worker",
    },
    {
      id: 32,
      airline: "Oceania Construction",
      passengerName: "Emma Davis",
      flightNo: "WRK-6789",
      destination: "Site Access",
      profile: "https://i.pravatar.cc/150?img=32",
      designation: "Security",
    },
    {
      id: 33,
      airline: "Pacific Builders",
      passengerName: "James Wilson",
      flightNo: "WRK-0123",
      destination: "Security Checkpoint",
      profile: "https://i.pravatar.cc/150?img=33",
      designation: "Security",
    },
    {
      id: 34,
      airline: "American Construction",
      passengerName: "Robert Johnson",
      flightNo: "WRK-4567",
      destination: "Main Entrance",
      profile: "https://i.pravatar.cc/150?img=34",
      designation: "Security",
    },
    {
      id: 35,
      airline: "Delta Builders",
      passengerName: "Jennifer Smith",
      flightNo: "WRK-8901",
      destination: "Loading Dock",
      profile: "https://i.pravatar.cc/150?img=35",
      designation: "Forklift Operator",
    },
    {
      id: 36,
      airline: "Southwest Construction",
      passengerName: "David Miller",
      flightNo: "WRK-2345",
      destination: "Tool Storage",
      profile: "https://i.pravatar.cc/150?img=36",
      designation: "Tool Keeper",
    },
    {
      id: 37,
      airline: "United Builders",
      passengerName: "Lisa Anderson",
      flightNo: "WRK-6789",
      destination: "Break Area",
      profile: "https://i.pravatar.cc/150?img=37",
      designation: "Worker",
    },
    {
      id: 38,
      airline: "Alaska Construction",
      passengerName: "Thomas White",
      flightNo: "WRK-0123",
      destination: "Emergency Exit",
      profile: "https://i.pravatar.cc/150?img=38",
      designation: "Safety Officer",
    },
  ];

  healthStatsForm = new FormGroup({
    classLevel: new FormControl("", Validators.required),
    className: new FormControl("", Validators.required),
  });

  getLatestValue(serviceArray: any) {
    if (serviceArray.length > 0) {
      return parseFloat(serviceArray[serviceArray.length - 1].value.toFixed(2));
    }
    return 0;
  }
  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    public createSectionService: CreateSectionService,
    public classLevelService: ClassByLevelSchedulingService,
    public classSectionService: ClassSectionService,
    public healthService: HealthService,
    public avatarService: AvatarService
  ) {}

  ngOnInit() {
    // Static demo: no API calls for campuses and no auto-selections
    this.selectedCampusFilter.subject.subscribe(() => {
      if (!this.selectedCampusFilter()) {
        this.selectedBuildingFilter.setValue(null);
        this.selectedFloorFilter.setValue(null);
      }
    });

    this.getAllClassSections();
    // this.createSectionService.getChilds();
    this.classLevelService.getAllClassLevels();
    this.classLevelService.classLevels.subject.subscribe({
      next: () => {
        const firstLevel = this.levelList()?.[0]?.value;
        if (firstLevel) {
          this.onLevelChange(firstLevel, "level");
        }
      },
    });
    this.classSectionService.classSections.subject.subscribe({
      next: () => {
        const firstLevel = this.classNameList()?.[0]?.value;
        if (firstLevel) {
          this.onLevelChange(firstLevel, "className");
        }
      },
    });
    this.classSectionService.classSectionById.subject.subscribe({
      next: () => {
        const firstClass = this.classSectionService.classSectionById()?.[0];
        if (firstClass) {
          this.setActiveStudent(firstClass);
        }
      },
    });
    this.addNewArrival();

    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        // Check if we've reached the maximum limit
        if (this.arrivals.length < this.maxItems) {
          this.addNewArrival();
          // Explicitly trigger change detection
          this.cdr.detectChanges();
        } else if (this.intervalId) {
          // Stop the interval when max limit is reached
          clearInterval(this.intervalId);
          this.intervalId = null;
          // Update UI to show we've stopped
          this.ngZone.run(() => {});
        }
      }, 5000);
    });
  }

  onFlightChange(selected: any) {
    const value = typeof selected === "object" ? selected.value : selected;
    this.selectedFlightNo.setValue(value ?? "");
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Clean up the interval when component is destroyed
    if (this.tabInterval) {
      clearInterval(this.tabInterval);
    }
  }
  onCampusFilterChange(campusId: any) {
    if (campusId == "null" || campusId == null || campusId == undefined || campusId == "") {
      this.campusForm.patchValue({ campusId: "", buildingId: "", floorId: "" });
    } else {
      this.campusForm.patchValue({ campusId: campusId });
    }
    const campus: any = this.selectedCampusFilter() ? this.selectedCampusFilter() : this.staticCampuses.find(c => c.id === campusId);
    if (!campus && campusId) {
      // fallback search in static list
      const found = this.staticCampuses.find(c => c.id === campusId);
      this.selectedCampusFilter.setValue(found ?? null);
      return;
    }
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
    // Independent Gate selection: search across all gates
    const floor: any = this.staticCampuses
      .flatMap((c: any) => c.buildings || [])
      .flatMap((b: any) => b.floors || [])
      .find((f: any) => f.id === floorId);
    this.selectedFloorFilter.setValue(floor);
    //  this.humidityService.getAllHumidity(this.humidityLoader, floorId);
  }
  getAllClassSections() {
    this.classSectionService.getAllClassSections().subject.subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        console.error(err.message);
      },
    });
  }
  onLevelChange(selectedLevel: any, type?: string) {
    const value = typeof selectedLevel === "object" ? selectedLevel.value : selectedLevel;

    if (type === "level") {
      // this.classLevelId.setValue(value);
      this.healthStatsForm.patchValue({ classLevel: value });
      if (this.healthStatsForm.value.classLevel === "") {
        this.healthStatsForm.patchValue({ className: "" });
      }
      const apiCall = this.classSectionService.getByClassLevel(value);
      if (apiCall?.subject) {
        apiCall.subject.subscribe({
          next: response => {
            if (!response?.data?.length) {
              this.healthStatsForm.patchValue({ className: "" });
            }
          },
        });
      }
    }

    if (type === "className") {
      this.healthStatsForm.patchValue({ className: value });
      if (value) {
        // this.classSectionId.setValue(value);
        this.classSectionService.getByClassSectionId(value);
      } else {
        // this.classLevelId.setValue(this.healthStatsForm.value.classLevel || "");
        // this.classSectionId.setValue("");
        this.healthStatsForm.patchValue({ className: "" });
        // this.configureSectionService.selectedChildren.next(null);
      }
    }
  }
  setActiveStudent(student: any) {
    if (student) {
      if (this.activeStudent === student) {
        this.healthService.getHealthDetail(student);
        this.activeStudent = null;
      } else {
        this.activeStudent = student;
        this.healthService.getHealthDetail(student);
      }
    }
  }

  addNewArrival() {
    if (this.arrivals.length >= this.maxItems) {
      return; // Extra safety check
    }

    // Get a random person from allSchoolData
    const randomIndex = Math.floor(Math.random() * this.allSchoolData.length);
    const person = this.allSchoolData[randomIndex];

    const newItem = {
      id: person.id,
      name: person.passengerName,
      designation: person.designation,
      flightNo: person.flightNo,
      destination: person.destination,

      avatar: person.profile,
      timestamp: new Date(),
    };

    this.arrivals = [newItem, ...this.arrivals];
    // this.counter++;
    if (person.designation === "Security") {
      this.teacherCount++;
    } else if (person.designation === "Staff") {
      this.staffCount++;
    } else {
      this.childrenCount++;
    }

    // Add a new dot for the arrival
    this.addNewDot(person.designation === "Security", person.designation === "Staff");
  }

  addNewDot(isTeacher: boolean, isStaff: boolean) {
    // Start position (entrance)

    const startPoints = [
      { x: 60, y: 60 },
      { x: 28, y: 70 },
      { x: 80, y: 50 },
    ];

    const startIndex = Math.floor(Math.random() * startPoints.length);
    const startX = startPoints[startIndex].x + Math.random() * 10;
    const startY = startPoints[startIndex].y + Math.random() * 10;

    // Random target position within the school
    const targetX = 20 + Math.random() * 60; // Keep within 20-80% of width
    const targetY = 20 + Math.random() * 60; // Keep within 20-80% of height

    const newDot: Dot = {
      id: this.counter,
      x: startX,
      y: startY,
      isTeacher,
      isStaff,
      targetX,
      targetY,
    };

    this.activeDots = [...this.activeDots, newDot];
  }

  // TrackBy function for better performance with *ngFor
  trackByFn(index: number, item: any): number {
    return item.id;
  }

  // Animate the dot movement
  animateDot() {
    this.activeDots = this.activeDots.map(dot => {
      // Calculate the direction vector
      const dx = dot.targetX - dot.x;
      const dy = dot.targetY - dot.y;

      // Calculate the distance
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If we're close enough to the target, stop moving
      if (distance < 0.5) {
        return dot;
      }

      // Move 1% of the distance each interval
      const speed = 0.08;
      const moveX = (dx / distance) * speed;
      const moveY = (dy / distance) * speed;

      return {
        ...dot,
        x: dot.x + moveX,
        y: dot.y + moveY,
      };
    });

    this.cdr.detectChanges();
  }

  // Tabs Switiching
  setActiveTab(index: number) {
    this.activeTabIndex = index;
    this.moveSliderToTab(index);
  }

  moveSliderToTab(index: number) {
    const tabButtons = this.tabButtons.toArray();
    if (tabButtons.length === 0) return;

    const activeTab = tabButtons[index].nativeElement;
    const slider = this.elementRef.nativeElement.querySelector(".bg-active-slide");
    const tabsList = this.elementRef.nativeElement.querySelector(".nav-pills-tabs-list");

    // Get the position of the tab relative to the tabs list
    const tabRect = activeTab.getBoundingClientRect();
    const tabsListRect = tabsList.getBoundingClientRect();

    // Calculate the left position (relative to the tabs list)
    const leftPosition = tabRect.left - tabsListRect.left;

    // Apply the transformation
    slider.style.width = `${tabRect.width}px`;
    slider.style.transform = `translateX(${leftPosition}px)`;
  }

  // Map Toggle Icon
  isActive = false;

  toggleMap(): void {
    this.isActive = !this.isActive;
  }
}
