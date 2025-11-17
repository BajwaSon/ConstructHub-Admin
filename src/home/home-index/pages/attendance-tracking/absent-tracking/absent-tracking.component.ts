/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";

interface Person {
  id: number;
  name: string;
  imageUrl: string;
  isAbsent: boolean;
}

interface TicketInfo {
  pnr: string;
  flightNumber: string;
  airline: string;
  from: string;
  to: string;
  departureTime: string;
  boardingTime: string;
  terminal: string;
  gate: string;
  seat: string;
  travelClass: string;
  status: string;
  baggage: string;
  passport: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  statusFilter: string; // Add status filter for each category
}

interface Dot {
  id: number;
  x: number;
  y: number;
  isTeacher: boolean;
  isStaff: boolean;
  targetX: number;
  targetY: number;
  isAnimating?: boolean;
}

@Component({
  selector: "app-absent-tracking",
  imports: [CommonModule],
  templateUrl: "./absent-tracking.component.html",
  styleUrl: "./absent-tracking.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AbsentTrackingComponent implements OnInit, OnDestroy {
  activeTab = "last_call";
  selectedPerson: Person | null = null;
  showLocationModal = false;
  modalMapDots: Dot[] = [];
  countdownTimers: { [key: number]: string } = {};
  countdownData: { [key: number]: { minutes: string; seconds: string; days: string } } = {};
  animationCountdown: number = 0;
  private countdownInterval: any;
  private animationInterval: any;

  constructor(private cdr: ChangeDetectorRef) {}

  // Helper method to generate dynamic departure and boarding times
  private generateDynamicTimes(): { departureTime: string; boardingTime: string } {
    const now = new Date();

    // Generate random minutes between 5-10 for departure time
    const departureMinutes = 5 + Math.floor(Math.random() * 6); // 5-10 minutes
    const departureTime = new Date(now);
    departureTime.setMinutes(now.getMinutes() + departureMinutes);

    // Boarding time is 10 minutes before departure
    const boardingTime = new Date(departureTime);
    boardingTime.setMinutes(departureTime.getMinutes() - 10);

    // Format as YYYY-MM-DD HH:MM (same format as existing)
    const formatTime = (date: Date): string => {
      return date.toISOString().slice(0, 16).replace("T", " ");
    };

    return {
      departureTime: formatTime(departureTime),
      boardingTime: formatTime(boardingTime),
    };
  }

  // Helper method to generate dynamic times with passenger-specific offset
  private generateDynamicTimesForPassenger(passengerId: number): { departureTime: string; boardingTime: string } {
    const now = new Date();

    // Generate base minutes between 5-10, then add passenger-specific offset
    const baseMinutes = 1 + Math.floor(Math.random() * 6); // 5-10 minutes
    const passengerOffset = (passengerId % 5) * 2; // 0, 2, 4, 6, 8 minutes offset
    const departureMinutes = baseMinutes + passengerOffset;

    const departureTime = new Date(now);
    departureTime.setMinutes(now.getMinutes() + departureMinutes);

    // Boarding time is 10 minutes before departure
    const boardingTime = new Date(departureTime);
    boardingTime.setMinutes(departureTime.getMinutes() - 10);

    // Format as YYYY-MM-DD HH:MM (same format as existing)
    // const formatTime = (date: Date): string => {
    //   return date.toISOString().slice(0, 16).replace('T', ' ');
    // };

    return {
      departureTime: departureTime.toISOString(),
      boardingTime: boardingTime.toISOString(),
    };
  }

  ngOnInit(): void {
    // Initialize ticket data with dynamic times
    this.initializeTicketData();
    this.startCountdownTimers();
    // Initialize countdown data for all passengers
    this.initializeCountdownData();
  }
  ngAfterViewInit(): void {
    this.startRandomDots();
    document.addEventListener("click", (e: MouseEvent) => {
      const popup = document.getElementById("dotPopup");
      if (!popup) return;
      if (!(e.target as HTMLElement).classList.contains("pulse-dot") && !(e.target as HTMLElement).classList.contains("security-guard")) {
        popup.style.display = "none";
        popup.removeAttribute("data-persist");
      }
    });
  }
  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  private startCountdownTimers(): void {
    // Update countdown every second
    this.countdownInterval = setInterval(() => {
      this.updateAllCountdowns();
    }, 1000);

    // Initial update
    this.updateAllCountdowns();
  }

  private initializeCountdownData(): void {
    this.categories.forEach(category => {
      const passengers = this.getAbsentPeople(category.id);
      passengers.forEach(person => {
        this.countdownData[person.id] = {
          days: this.getCountdownDays(person),
          minutes: this.getCountdownMinutes(person),
          seconds: this.getCountdownSeconds(person),
        };
      });
    });
  }

  private updateAllCountdowns(): void {
    this.categories.forEach(category => {
      const passengers = this.getAbsentPeople(category.id);
      passengers.forEach(person => {
        this.countdownTimers[person.id] = this.calculateCountdown(person);
        // Update reactive countdown data
        this.countdownData[person.id] = {
          days: this.getCountdownDays(person),
          minutes: this.getCountdownMinutes(person),
          seconds: this.getCountdownSeconds(person),
        };
      });
    });
    // Trigger change detection to update the UI
    this.cdr.detectChanges();
  }

  // All passengers data - Constructor site based
  allPassengers: Person[] = [
    { id: 1, name: "Ahmed Hassan", imageUrl: "https://i.pravatar.cc/150?img=1", isAbsent: true },
    { id: 2, name: "Sarah Johnson", imageUrl: "https://i.pravatar.cc/150?img=2", isAbsent: true },
    { id: 3, name: "Mohammed Ali", imageUrl: "https://i.pravatar.cc/150?img=3", isAbsent: true },
    { id: 4, name: "Emma Wilson", imageUrl: "https://i.pravatar.cc/150?img=4", isAbsent: true },
    { id: 5, name: "Hans Mueller", imageUrl: "https://i.pravatar.cc/150?img=5", isAbsent: true },
    { id: 6, name: "Marie Dubois", imageUrl: "https://i.pravatar.cc/150?img=6", isAbsent: true },
    { id: 7, name: "Fatima Al-Zahra", imageUrl: "https://i.pravatar.cc/150?img=7", isAbsent: true },
    { id: 8, name: "Abdullah Rahman", imageUrl: "https://i.pravatar.cc/150?img=8", isAbsent: true },
    { id: 9, name: "James Thompson", imageUrl: "https://i.pravatar.cc/150?img=9", isAbsent: true },
    { id: 10, name: "Anna Schmidt", imageUrl: "https://i.pravatar.cc/150?img=10", isAbsent: true },
    { id: 11, name: "Zeynep Kaya", imageUrl: "https://i.pravatar.cc/150?img=11", isAbsent: true },
    { id: 12, name: "Omar Al-Sayed", imageUrl: "https://i.pravatar.cc/150?img=12", isAbsent: true },
    { id: 13, name: "Layla Al-Hashimi", imageUrl: "https://i.pravatar.cc/150?img=13", isAbsent: true },
    { id: 14, name: "Khalid Al-Mansouri", imageUrl: "https://i.pravatar.cc/150?img=14", isAbsent: true },
    { id: 15, name: "Pierre Moreau", imageUrl: "https://i.pravatar.cc/150?img=15", isAbsent: true },
    { id: 16, name: "Priya Patel", imageUrl: "https://i.pravatar.cc/150?img=16", isAbsent: true },
    { id: 17, name: "Salim Al-Rashidi", imageUrl: "https://i.pravatar.cc/150?img=17", isAbsent: true },
    { id: 18, name: "Aisha Khan", imageUrl: "https://i.pravatar.cc/150?img=18", isAbsent: true },
  ];

  private ticketInfoByPersonId: Record<number, TicketInfo> = {};

  // Initialize ticket data with dynamic times - Constructor site based
  private initializeTicketData(): void {
    this.ticketInfoByPersonId = {
      1: {
        pnr: "WRK-1234",
        flightNumber: "ASG-205",
        airline: "ABC Construction",
        from: "Main Gate",
        to: "Foundation Zone",
        departureTime: this.generateDynamicTimesForPassenger(1).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(1).boardingTime,
        terminal: "Site Section A",
        gate: "Gate 1",
        seat: "Work Station 12A",
        travelClass: "Foreman",
        status: "Last Call",
        baggage: "Tool Kit A",
        passport: "ID-987654321",
      },
      2: {
        pnr: "WRK-5678",
        flightNumber: "ASG-101",
        airline: "XYZ Builders",
        from: "North Entrance",
        to: "Structural Zone",
        departureTime: this.generateDynamicTimesForPassenger(2).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(2).boardingTime,
        terminal: "Site Section B",
        gate: "Gate 2",
        seat: "Work Station 3K",
        travelClass: "Engineer",
        status: "Missed",
        baggage: "Tool Kit B",
        passport: "ID-112233445",
      },
      3: {
        pnr: "WRK-9012",
        flightNumber: "ASG-012",
        airline: "Metro Construction",
        from: "East Gate",
        to: "Electrical Zone",
        departureTime: this.generateDynamicTimesForPassenger(3).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(3).boardingTime,
        terminal: "Site Section C",
        gate: "Gate 3",
        seat: "Work Station 21C",
        travelClass: "Electrician",
        status: "Missed",
        baggage: "Tool Kit C",
        passport: "ID-556677889",
      },
      4: {
        pnr: "WRK-3456",
        flightNumber: "ASG-301",
        airline: "Prime Builders",
        from: "South Gate",
        to: "Plumbing Zone",
        departureTime: this.generateDynamicTimesForPassenger(4).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(4).boardingTime,
        terminal: "Site Section D",
        gate: "Gate 4",
        seat: "Work Station 8F",
        travelClass: "Plumber",
        status: "Missed",
        baggage: "Tool Kit D",
        passport: "ID-998877665",
      },
      5: {
        pnr: "WRK-7890",
        flightNumber: "ASG-205",
        airline: "Elite Construction",
        from: "West Gate",
        to: "HVAC Zone",
        departureTime: this.generateDynamicTimesForPassenger(5).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(5).boardingTime,
        terminal: "Site Section E",
        gate: "Gate 5",
        seat: "Work Station 15K",
        travelClass: "HVAC Technician",
        status: "Missed",
        baggage: "Tool Kit E",
        passport: "ID-887766554",
      },
      6: {
        pnr: "WRK-2345",
        flightNumber: "ASG-045",
        airline: "Global Builders",
        from: "Main Gate",
        to: "Finishing Zone",
        departureTime: this.generateDynamicTimesForPassenger(6).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(6).boardingTime,
        terminal: "Site Section F",
        gate: "Gate 1",
        seat: "Work Station 22A",
        travelClass: "Worker",
        status: "Last Call",
        baggage: "Tool Kit F",
        passport: "ID-776655443",
      },
      7: {
        pnr: "WRK-6789",
        flightNumber: "ASG-412",
        airline: "XYZ Builders",
        from: "North Entrance",
        to: "Structural Zone",
        departureTime: this.generateDynamicTimesForPassenger(7).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(7).boardingTime,
        terminal: "Site Section B",
        gate: "Gate 2",
        seat: "Work Station 7C",
        travelClass: "Worker",
        status: "Last Call",
        baggage: "Tool Kit G",
        passport: "ID-665544332",
      },
      8: {
        pnr: "WRK-0123",
        flightNumber: "ASG-078",
        airline: "Metro Construction",
        from: "East Gate",
        to: "Electrical Zone",
        departureTime: this.generateDynamicTimesForPassenger(8).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(8).boardingTime,
        terminal: "Site Section C",
        gate: "Gate 3",
        seat: "Work Station 14F",
        travelClass: "Electrician",
        status: "Last Call",
        baggage: "Tool Kit H",
        passport: "ID-554433221",
      },
      9: {
        pnr: "WRK-4567",
        flightNumber: "ASG-089",
        airline: "Prime Builders",
        from: "South Gate",
        to: "Plumbing Zone",
        departureTime: this.generateDynamicTimesForPassenger(9).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(9).boardingTime,
        terminal: "Site Section D",
        gate: "Gate 4",
        seat: "Work Station 19K",
        travelClass: "Plumber",
        status: "Missed",
        baggage: "Tool Kit I",
        passport: "ID-443322110",
      },
      10: {
        pnr: "WRK-8901",
        flightNumber: "ASG-156",
        airline: "Elite Construction",
        from: "West Gate",
        to: "HVAC Zone",
        departureTime: this.generateDynamicTimesForPassenger(10).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(10).boardingTime,
        terminal: "Site Section E",
        gate: "Gate 5",
        seat: "Work Station 11A",
        travelClass: "HVAC Technician",
        status: "Missed",
        baggage: "Tool Kit J",
        passport: "ID-332211009",
      },
      11: {
        pnr: "WRK-2345",
        flightNumber: "ASG-234",
        airline: "ABC Construction",
        from: "Main Gate",
        to: "Foundation Zone",
        departureTime: this.generateDynamicTimesForPassenger(11).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(11).boardingTime,
        terminal: "Site Section A",
        gate: "Gate 1",
        seat: "Work Station 6F",
        travelClass: "Worker",
        status: "Last Call",
        baggage: "Tool Kit K",
        passport: "ID-221100998",
      },
      12: {
        pnr: "WRK-6789",
        flightNumber: "ASG-067",
        airline: "Desert Builders",
        from: "North Entrance",
        to: "Site Office",
        departureTime: this.generateDynamicTimesForPassenger(12).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(12).boardingTime,
        terminal: "Site Section B",
        gate: "Gate 2",
        seat: "Work Station 6F",
        travelClass: "Staff",
        status: "Last Call",
        baggage: "Office Supplies",
        passport: "ID-221100998",
      },
      13: {
        pnr: "WRK-0123",
        flightNumber: "ASG-234",
        airline: "Jordan Construction",
        from: "East Gate",
        to: "Material Storage",
        departureTime: this.generateDynamicTimesForPassenger(13).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(13).boardingTime,
        terminal: "Site Section C",
        gate: "Gate 3",
        seat: "Work Station 6F",
        travelClass: "Material Handler",
        status: "Underage",
        baggage: "Handling Equipment",
        passport: "ID-221100998",
      },
      14: {
        pnr: "WRK-4567",
        flightNumber: "ASG-234",
        airline: "Gulf Builders",
        from: "South Gate",
        to: "Parking Area",
        departureTime: this.generateDynamicTimesForPassenger(14).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(14).boardingTime,
        terminal: "Site Section D",
        gate: "Gate 4",
        seat: "Work Station 6F",
        travelClass: "Security",
        status: "Underage",
        baggage: "Security Equipment",
        passport: "ID-221100998",
      },
      15: {
        pnr: "WRK-8901",
        flightNumber: "ASG-234",
        airline: "European Construction",
        from: "West Gate",
        to: "Finishing Zone",
        departureTime: this.generateDynamicTimesForPassenger(15).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(15).boardingTime,
        terminal: "Site Section E",
        gate: "Gate 5",
        seat: "Work Station 6F",
        travelClass: "Supervisor",
        status: "Underage",
        baggage: "Supervisor Kit",
        passport: "ID-221100998",
      },
      16: {
        pnr: "WRK-2345",
        flightNumber: "ASG-234",
        airline: "Asia Pacific Builders",
        from: "Main Gate",
        to: "Concrete Works",
        departureTime: this.generateDynamicTimesForPassenger(16).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(16).boardingTime,
        terminal: "Site Section A",
        gate: "Gate 1",
        seat: "Work Station 6F",
        travelClass: "Concrete Worker",
        status: "Wheelchair",
        baggage: "Concrete Tools",
        passport: "ID-221100998",
      },
      17: {
        pnr: "WRK-6789",
        flightNumber: "ASG-234",
        airline: "Oman Construction",
        from: "North Entrance",
        to: "Steel Works",
        departureTime: this.generateDynamicTimesForPassenger(17).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(17).boardingTime,
        terminal: "Site Section B",
        gate: "Gate 2",
        seat: "Work Station 6F",
        travelClass: "Steel Worker",
        status: "Wheelchair",
        baggage: "Steel Tools",
        passport: "ID-221100998",
      },
      18: {
        pnr: "WRK-0123",
        flightNumber: "ASG-234",
        airline: "South Asia Builders",
        from: "East Gate",
        to: "Masonry Zone",
        departureTime: this.generateDynamicTimesForPassenger(18).departureTime,
        boardingTime: this.generateDynamicTimesForPassenger(18).boardingTime,
        terminal: "Site Section C",
        gate: "Gate 3",
        seat: "Work Station 6F",
        travelClass: "Mason",
        status: "Wheelchair",
        baggage: "Masonry Tools",
        passport: "ID-221100998",
      },
    };
  }

  // Security guard positions - all inside terminal (same as plain-map-tracker)
  securityGuards = [
    { x: 5, y: 15, name: "Officer Johnson", status: "active" },
    { x: 20, y: 50, name: "Inspector Smith", status: "active" },
    { x: 35, y: 58, name: "Officer Davis", status: "active" },
    { x: 60, y: 60, name: "Inspector Wilson", status: "active" },
    { x: 50, y: 10, name: "Officer Brown", status: "active" },
    { x: 75, y: 60, name: "Inspector Miller", status: "active" },
    { x: 90, y: 55, name: "Officer Garcia", status: "active" },
    { x: 84, y: 15, name: "Inspector Martinez", status: "active" },
    { x: 25, y: 80, name: "Officer Anderson", status: "active" },
    { x: 50, y: 45, name: "Inspector Taylor", status: "active" },
  ];

  categories: Category[] = [
    {
      id: "last_call",
      name: "On Site Workers",
      icon: "/images/bell-icon.svg",
      statusFilter: "Last Call",
    },
    {
      id: "missed",
      name: "Off Site Workers",
      icon: "/images/close-circle.svg",
      statusFilter: "Missed",
    },
    {
      id: "under_age",
      name: "Site Staff",
      icon: "/images/patient-group.svg",
      statusFilter: "Underage", // Underage passengers are boarding
    },
    {
      id: "wheelchair",
      name: "Site Security",
      icon: "/images/person-wheelchair.svg",
      statusFilter: "Wheelchair", // Wheelchair passengers are boarding
    },
  ];
  startRandomDots(): void {
    // Clear and setup underage map container
    const underAgeContainer = document.getElementById("underAgePulseDotsContainer");
    if (underAgeContainer) {
      underAgeContainer.innerHTML = "";
      if (this.activeTab === "under_age") {
        this.createPassengerIcons("under_age", "underAgePulseDotsContainer");
      }
    }

    // Clear and setup wheelchair map container
    const wheelchairContainer = document.getElementById("wheelchairPulseDotsContainer");
    if (wheelchairContainer) {
      wheelchairContainer.innerHTML = "";
      if (this.activeTab === "wheelchair") {
        this.createPassengerIcons("wheelchair", "wheelchairPulseDotsContainer");
      }
    }
  }

  // Update maps when switching between map categories
  private updateActiveMap(): void {
    if (this.activeTab === "under_age") {
      // Clear wheelchair map and show underage map
      const wheelchairContainer = document.getElementById("wheelchairPulseDotsContainer");
      if (wheelchairContainer) {
        wheelchairContainer.innerHTML = "";
      }

      const underAgeContainer = document.getElementById("underAgePulseDotsContainer");
      if (underAgeContainer) {
        underAgeContainer.innerHTML = "";
        this.createPassengerIcons("under_age", "underAgePulseDotsContainer");
      }
    } else if (this.activeTab === "wheelchair") {
      // Clear underage map and show wheelchair map
      const underAgeContainer = document.getElementById("underAgePulseDotsContainer");
      if (underAgeContainer) {
        underAgeContainer.innerHTML = "";
      }

      const wheelchairContainer = document.getElementById("wheelchairPulseDotsContainer");
      if (wheelchairContainer) {
        wheelchairContainer.innerHTML = "";
        // Add security guards for wheelchair map
        for (const guard of this.securityGuards) {
          this.addSecurityGuardAtPosition(guard.x, guard.y, guard.name, guard.status, "wheelchairPulseDotsContainer");
        }
        // Create passenger icons for wheelchair
        this.createPassengerIcons("wheelchair", "wheelchairPulseDotsContainer");
      }
    }
  }
  addSecurityGuardAtPosition(x: number, y: number, name: string, status: string, containerId: string = "pulseDotsContainer"): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const guardElement = document.createElement("div");
    guardElement.className = "security-guard";
    guardElement.style.position = "absolute";
    guardElement.style.left = `${x}%`;
    guardElement.style.top = `${y}%`;

    // Create the police/inspector icon using emoji
    const icon = document.createElement("div");
    icon.innerHTML = "👮";
    icon.style.fontSize = "28px";
    icon.style.textAlign = "center";
    icon.style.lineHeight = "32px";
    icon.style.filter = "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))";

    // Store guard details as data attributes
    guardElement.dataset["name"] = name;
    guardElement.dataset["status"] = status;

    guardElement.appendChild(icon);

    // Add hover effects
    guardElement.addEventListener("mouseenter", e => this.showSecurityGuardPopup(e, guardElement));
    guardElement.addEventListener("mouseleave", () => this.hideSecurityGuardPopup());
    guardElement.addEventListener("mousemove", e => this.moveSecurityGuardPopup(e));

    container.appendChild(guardElement);
  }

  showSecurityGuardPopup(event: MouseEvent, guardElement: HTMLElement): void {
    const popup = document.getElementById("dotPopup");
    if (!popup) return;

    const name = guardElement.dataset["name"];
    const status = guardElement.dataset["status"];

    // Create the police/inspector popup HTML
    popup.innerHTML = `
      <div class="popup-header">
        <h3 class="popup-title">👮 Police Inspector</h3>
      </div>
      
      <div class="info-grid">
        <div class="info-item highlight">
          <span class="info-label">
            <span class="status-indicator ${status === "active" ? "status-active" : "status-inactive"}"></span>
            Officer Name
          </span>
          <span class="info-value">${name}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Status</span>
          <span class="info-value ${status === "active" ? "status-active" : "status-inactive"}">${status}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Location</span>
          <span class="info-value">Terminal Security</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">Badge Number</span>
          <span class="info-value">${name?.replace(/Officer |Inspector /, "P") || "Unknown"}</span>
        </div>
      </div>
    `;

    // Position the popup near the guard
    popup.style.display = "block";
    popup.style.visibility = "hidden";

    // Get popup dimensions
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event.clientX + 15;
    let top = event.clientY - 15;

    // Adjust horizontal position if popup would be cut off
    if (left + popupRect.width > viewportWidth) {
      left = event.clientX - popupRect.width - 15;
    }

    // Adjust vertical position if popup would be cut off
    if (top + popupRect.height > viewportHeight) {
      top = event.clientY - popupRect.height + 15;
    }

    // Ensure popup doesn't go off-screen
    left = Math.max(10, Math.min(left, viewportWidth - popupRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupRect.height - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.visibility = "visible";
  }

  hideSecurityGuardPopup(event?: MouseEvent): void {
    const popup = document.getElementById("dotPopup");
    if (popup && popup.getAttribute("data-persist") !== "true") {
      popup.style.display = "none";
    }
  }

  moveSecurityGuardPopup(event: MouseEvent): void {
    const popup = document.getElementById("dotPopup");
    if (!popup || popup.getAttribute("data-persist") === "true") return;

    // Get popup dimensions for positioning
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event.clientX + 15;
    let top = event.clientY - 15;

    // Adjust position to prevent cutoff
    if (left + popupRect.width > viewportWidth) {
      left = event.clientX - popupRect.width - 15;
    }

    if (top + popupRect.height > viewportHeight) {
      top = event.clientY - popupRect.height + 15;
    }

    left = Math.max(10, Math.min(left, viewportWidth - popupRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupRect.height - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    this.selectedPerson = null;

    // If switching to a map category, update the active map
    if (this.isMapView(tabId)) {
      setTimeout(() => {
        this.updateActiveMap();
      }, 100);
    } else {
      // Refresh all icons when tab changes to non-map categories
      setTimeout(() => {
        this.startRandomDots();
      }, 100);
    }
  }

  getAbsentPeople(categoryId: string): Person[] {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (!category) return [];

    // Filter passengers based on their status matching the category filter
    return this.allPassengers.filter(person => {
      if (!person) return false;
      const ticketInfo = this.getTicketFor(person);
      return ticketInfo && ticketInfo.status === category.statusFilter;
    });
  }

  getActiveCategory(): Category | undefined {
    return this.categories.find(cat => cat.id === this.activeTab);
  }

  // Return ticket info for a given person (generate defaults when missing)
  getTicketFor(person: Person | null): TicketInfo {
    if (!person) {
      return {
        pnr: "N/A",
        flightNumber: "N/A",
        airline: "N/A",
        from: "N/A",
        to: "N/A",
        departureTime: "N/A",
        boardingTime: "N/A",
        terminal: "N/A",
        gate: "N/A",
        seat: "N/A",
        travelClass: "N/A",
        status: "N/A",
        baggage: "N/A",
        passport: "N/A",
      };
    }

    const preset = this.ticketInfoByPersonId[person.id];
    if (preset) return preset;

    // Generate dynamic departure and boarding times (5-10 minutes from now)
    const dynamicTimes = this.generateDynamicTimes();
    console.log(dynamicTimes);

    // Construction site based default data
    const constructionCompanies = ["ABC Construction", "XYZ Builders", "Metro Construction", "Prime Builders", "Elite Construction"];
    const siteZones = ["Foundation Zone", "Structural Zone", "Electrical Zone", "Plumbing Zone", "HVAC Zone", "Finishing Zone"];
    const workerTypes = ["Worker", "Foreman", "Engineer", "Electrician", "Plumber", "HVAC Technician"];
    const entryGates = ["Main Gate", "North Entrance", "East Gate", "South Gate", "West Gate"];
    const siteSections = ["Site Section A", "Site Section B", "Site Section C", "Site Section D", "Site Section E"];

    return {
      pnr: `WRK-${(1000 + person.id).toString().padStart(4, "0")}`,
      flightNumber: `ASG-${200 + person.id}`,
      airline: constructionCompanies[person.id % constructionCompanies.length],
      from: entryGates[person.id % entryGates.length],
      to: siteZones[person.id % siteZones.length],
      departureTime: dynamicTimes.departureTime,
      boardingTime: dynamicTimes.boardingTime,
      terminal: siteSections[person.id % siteSections.length],
      gate: `Gate ${(person.id % 5) + 1}`,
      seat: `Work Station ${10 + (person.id % 20)}${String.fromCharCode(65 + (person.id % 6))}`,
      travelClass: workerTypes[person.id % workerTypes.length],
      status: "Boarding",
      baggage: person.id % 5 === 0 ? "Tool Kit B" : "Tool Kit A",
      passport: `ID-${900000000 + person.id}`,
    };
  }

  // Check if the category should show map view
  isMapView(categoryId: string): boolean {
    return categoryId === "under_age" || categoryId === "wheelchair";
  }

  // Get map dots for the specified category
  getMapDots(categoryId: string): Dot[] {
    const passengers = this.getAbsentPeople(categoryId);

    if (categoryId === "under_age") {
      // Position underage passengers (children) using security guard positions - INSIDE terminal
      return passengers.map((person, index) => {
        // Use security guard positions for underage passengers
        const positions = [
          // { x: 5, y: 15 },   // Officer Johnson
          { x: 20, y: 50 }, // Inspector Smith
          { x: 35, y: 58 }, // Officer Davis
          // { x: 60, y: 60 },  // Inspector Wilson
          { x: 50, y: 10 }, // Officer Brown
          { x: 75, y: 60 }, // Inspector Miller
          // { x: 90, y: 55 },  // Officer Garcia
          { x: 84, y: 15 }, // Inspector Martinez
          // { x: 25, y: 80 },  // Officer Anderson
          { x: 50, y: 45 }, // Inspector Taylor
        ];
        const position = positions[index % positions.length];
        return {
          id: person.id,
          x: position.x,
          y: position.y,
          targetX: position.x, // Same as current position - no movement
          targetY: position.y, // Same as current position - no movement
          isTeacher: false,
          isStaff: false,
        };
      });
    } else if (categoryId === "wheelchair") {
      // Position wheelchair passengers using security guard positions - INSIDE terminal
      return passengers.map((person, index) => {
        // Use security guard positions for wheelchair passengers
        const positions = [
          // { x: 5, y: 15 },   // Officer Johnson
          // { x: 20, y: 50 },  // Inspector Smith
          { x: 35, y: 58 }, // Officer Davis
          { x: 60, y: 60 }, // Inspector Wilson
          // { x: 50, y: 10 },  // Officer Brown
          { x: 75, y: 60 }, // Inspector Miller
          // { x: 90, y: 55 },  // Officer Garcia
          { x: 84, y: 15 }, // Inspector Martinez
          // { x: 25, y: 80 },  // Officer Anderson
          { x: 50, y: 45 }, // Inspector Taylor
        ];
        const position = positions[index % positions.length];
        return {
          id: person.id,
          x: position.x,
          y: position.y,
          targetX: position.x, // Same as current position - no movement
          targetY: position.y, // Same as current position - no movement
          isTeacher: false,
          isStaff: true,
        };
      });
    }

    // Default positioning
    return passengers.map((person, index) => ({
      id: person.id,
      x: 20 + ((index * 15) % 60),
      y: 30 + ((index * 20) % 40),
      isTeacher: false,
      isStaff: false,
      targetX: 20 + ((index * 15) % 60),
      targetY: 30 + ((index * 20) % 40),
    }));
  }

  // Open location modal for a specific passenger
  openLocationModal(person: Person, event: Event): void {
    event.stopPropagation();
    this.selectedPerson = person;
    this.showLocationModal = true;

    // Generate dots for all passengers in the current category
    const currentCategory = this.categories.find(cat => cat.id === this.activeTab);
    if (currentCategory) {
      const allPassengers = this.getAbsentPeople(this.activeTab);
      // this.modalMapDots = allPassengers.map((p, index) => ({
      //   id: p.id,
      //   x: 20 + (index * 15) % 60,
      //   y: 30 + (index * 20) % 40,
      //   isTeacher: false,
      //   isStaff: currentCategory.id === 'wheelchair',
      //   targetX: 20 + (index * 15) % 60,
      //   targetY: 30 + (index * 20) % 40,
      // }));

      // console.log(this.modalMapDots);

      this.modalMapDots = [
        {
          id: 1,
          x: 30,
          y: 70,
          isTeacher: false,
          isStaff: false,
          targetX: 50,
          targetY: 90,
        },
        {
          id: 6,
          x: 35,
          y: 80,
          isTeacher: false,
          isStaff: false,
          targetX: 20,
          targetY: 70,
        },
        {
          id: 7,
          x: 60,
          y: 75,
          isTeacher: false,
          isStaff: false,
          targetX: 90,
          targetY: 30,
        },
      ];

      // Start the delayed animation
      this.startDelayedAnimation();
    }
  }

  // Close location modal
  closeLocationModal(): void {
    this.showLocationModal = false;
    this.selectedPerson = null;
    this.modalMapDots = [];
    this.animationCountdown = 0;
    this.stopAnimation();
  }

  // Start the animation immediately
  private startDelayedAnimation(): void {
    // Clear any existing animation
    this.stopAnimation();
  }

  // Stop animation
  private stopAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  // Update animation frame

  // Easing function for smooth animation
  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  private calculateCountdown(person: Person): string {
    const ticket = this.getTicketFor(person);

    // Check if departure time is valid
    if (ticket.departureTime === "N/A" || !ticket.departureTime) {
      return "No Flight Data";
    }

    const departureTime = new Date(ticket.departureTime);

    // Check if the date is valid
    if (isNaN(departureTime.getTime())) {
      return "Invalid Date";
    }

    const now = new Date();
    const timeDiff = departureTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return "Flight Departed";
    }

    // Calculate total minutes and seconds for live countdown
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));
    const minutes = totalMinutes % 60;
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  }

  getCountdownForPerson(person: Person): string {
    return this.countdownTimers[person.id] || "Calculating...";
  }

  getReactiveCountdownDays(person: Person): string {
    return this.countdownData[person.id]?.days || "00";
  }

  getReactiveCountdownMinutes(person: Person): string {
    return this.countdownData[person.id]?.minutes || "00";
  }

  getReactiveCountdownSeconds(person: Person): string {
    return this.countdownData[person.id]?.seconds || "00";
  }

  getCountdownDays(person: Person): string {
    const ticket = this.getTicketFor(person);
    if (ticket.departureTime === "N/A" || !ticket.departureTime) {
      return "--";
    }

    const departureTime = new Date(ticket.departureTime);
    if (isNaN(departureTime.getTime())) {
      return "--";
    }

    const now = new Date();
    const timeDiff = departureTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return "00";
    }

    // Since we're using same date, days should always be 0
    return "00";
  }

  getCountdownMinutes(person: Person): string {
    const ticket = this.getTicketFor(person);
    if (ticket.departureTime === "N/A" || !ticket.departureTime) {
      return "--";
    }

    const departureTime = new Date(ticket.departureTime);
    if (isNaN(departureTime.getTime())) {
      return "--";
    }

    const now = new Date();
    const timeDiff = departureTime.getTime() - now.getTime();
    if (timeDiff <= 0) {
      return "00";
    }

    // Calculate total minutes remaining
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));

    // Return the actual minutes remaining (0-59 for display)
    const displayMinutes = totalMinutes % 60;
    return displayMinutes.toString().padStart(2, "0");
  }

  getCountdownSeconds(person: Person): string {
    const ticket = this.getTicketFor(person);
    if (ticket.departureTime === "N/A" || !ticket.departureTime) {
      return "--";
    }

    const departureTime = new Date(ticket.departureTime);
    if (isNaN(departureTime.getTime())) {
      return "--";
    }

    const now = new Date();
    const timeDiff = departureTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return "00";
    }

    // Calculate seconds from remaining milliseconds
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return seconds.toString().padStart(2, "0");
  }

  getCountdownClass(person: Person): string {
    const ticket = this.getTicketFor(person);

    // Check if departure time is valid
    if (ticket.departureTime === "N/A" || !ticket.departureTime) {
      return "countdown-departed";
    }

    const departureTime = new Date(ticket.departureTime);

    // Check if the date is valid
    if (isNaN(departureTime.getTime())) {
      return "countdown-departed";
    }

    const now = new Date();
    const timeDiff = departureTime.getTime() - now.getTime();

    // Calculate only minutes part (0-59) for consistent countdown logic
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (timeDiff <= 0) {
      return "countdown-departed";
    } else if (minutesLeft <= 5) {
      return "countdown-urgent"; // Very urgent - 5 minutes or less
    } else if (minutesLeft <= 10) {
      return "countdown-warning"; // Warning - 10 minutes or less
    } else {
      return "countdown-normal"; // Normal - more than 10 minutes
    }
  }

  showFlightDetails(person: Person): void {
    const ticket = this.getTicketFor(person);

    // Check if departure time is valid
    if (ticket.departureTime === "N/A" || !ticket.departureTime) {
      alert("No flight data available for this passenger.");
      return;
    }

    const departureTime = new Date(ticket.departureTime);

    // Check if the date is valid
    if (isNaN(departureTime.getTime())) {
      alert("Invalid flight date for this passenger.");
      return;
    }

    const now = new Date();
    const timeDiff = departureTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      alert(`Flight ${ticket.flightNumber} has already departed.`);
    } else {
      // Calculate time components for display
      const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

      let timeMessage = "";
      if (daysLeft > 0) {
        timeMessage = `${daysLeft} day(s), ${hoursLeft} hour(s), ${minutesLeft} minute(s)`;
      } else if (hoursLeft > 0) {
        timeMessage = `${hoursLeft} hour(s), ${minutesLeft} minute(s)`;
      } else {
        timeMessage = `${minutesLeft} minute(s), ${secondsLeft} second(s)`;
      }

      alert(
        `Flight ${ticket.flightNumber}\n` +
          `From: ${ticket.from} To: ${ticket.to}\n` +
          `Departure: ${ticket.departureTime}\n` +
          `Gate: ${ticket.gate}, Terminal: ${ticket.terminal}\n` +
          `Time remaining: ${timeMessage}`
      );
    }
  }

  // Show passenger popup for underage and wheelchair passengers
  showPassengerPopup(event: MouseEvent, dot: Dot, categoryId: string): void {
    const popup = document.getElementById("dotPopup");
    if (!popup) return;

    // Find the passenger data
    const passengers = this.getAbsentPeople(categoryId);
    const passenger = passengers.find(p => p.id === dot.id);
    if (!passenger) return;

    const ticket = this.getTicketFor(passenger);

    if (categoryId === "under_age") {
      // Create the underage passenger popup HTML - EXACTLY like showDotPopup
      popup.innerHTML = `
        <div class="popup-header">
          <h3 class="popup-title">👶 Site Staff</h3>
        </div>
        
        <div class="info-grid">
          <div class="info-item highlight">
            <span class="info-label">
              <span class="status-indicator status-active"></span>
              Passenger Name
            </span>
            <span class="info-value">${passenger.name}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Flight ID</span>
            <span class="info-value">${ticket.flightNumber}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Destination</span>
            <span class="info-value">${ticket.to}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Date</span>
            <span class="info-value">${ticket.departureTime}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Gate</span>
            <span class="info-value">${ticket.gate}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">
              <span class="status-indicator status-active"></span>
              Boarding Status
            </span>
            <span class="info-value">Underage - Requires Escort</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Gate Closes At</span>
            <span class="info-value">${ticket.departureTime}</span>
          </div>
          
          <div class="info-item highlight">
            <span class="info-label">Seat</span>
            <span class="info-value">${ticket.seat}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Zone</span>
            <span class="info-value">${ticket.terminal}</span>
          </div>

          <button class="check-status-btn">
          ✅ Send a last call
          </button>
        </div>
      `;
    } else if (categoryId === "wheelchair") {
      // Create the wheelchair passenger popup HTML - EXACTLY like showDotPopup
      popup.innerHTML = `
        <div class="popup-header">
          <h3 class="popup-title">♿ Site Security</h3>
        </div>
        
        <div class="info-grid">
          <div class="info-item highlight">
            <span class="info-label">
              <span class="status-indicator status-active"></span>
              Passenger Name
            </span>
            <span class="info-value">${passenger.name}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Flight ID</span>
            <span class="info-value">${ticket.flightNumber}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Destination</span>
            <span class="info-value">${ticket.to}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Date</span>
            <span class="info-value">${ticket.departureTime}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Gate</span>
            <span class="info-value">${ticket.gate}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">
              <span class="status-indicator status-active"></span>
              Boarding Status
            </span>
            <span class="info-value">Wheelchair - Requires Assistance</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Gate Closes At</span>
            <span class="info-value">${ticket.departureTime}</span>
          </div>
          
          <div class="info-item highlight">
            <span class="info-label">Seat</span>
            <span class="info-value">${ticket.seat}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Zone</span>
            <span class="info-value">${ticket.terminal}</span>
          </div>

          <button class="check-status-btn">
          ✅ Send a last call
          </button>
        </div>
      `;
    }

    // Add click event listener for the button - EXACTLY like showDotPopup
    const checkBtn = popup.querySelector(".check-status-btn") as HTMLButtonElement;
    if (checkBtn) {
      checkBtn.addEventListener("click", () => {
        // Update icon to indicate action
        checkBtn.innerHTML = "🔊 Processing...";

        // Simulate action completion after 2 seconds
        setTimeout(() => {
          checkBtn.innerHTML = "✅ Action Completed";
          // Reset button after 1 more second
          setTimeout(() => {
            checkBtn.innerHTML = "✅ Send a last call";
          }, 1000);
        }, 2000);
      });
    }

    // Position the popup near the dot - EXACTLY like showDotPopup
    popup.style.display = "block";
    popup.style.visibility = "hidden";

    // Get popup dimensions
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event.clientX + 15;
    let top = event.clientY - 15;

    // Adjust horizontal position if popup would be cut off
    if (left + popupRect.width > viewportWidth) {
      left = event.clientX - popupRect.width - 15;
    }

    // Adjust vertical position if popup would be cut off
    if (top + popupRect.height > viewportHeight) {
      top = event.clientY - popupRect.height + 15;
    }

    // Ensure popup doesn't go off-screen
    left = Math.max(10, Math.min(left, viewportWidth - popupRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupRect.height - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.visibility = "visible"; // Show after positioning
  }

  // Hide passenger popup
  hidePassengerPopup(): void {
    const popup = document.getElementById("dotPopup");
    if (popup) {
      popup.style.display = "none";
    }
  }

  // Create passenger icons dynamically - EXACTLY like plain-map-tracker
  private createPassengerIcons(categoryId: string, containerId: string = "pulseDotsContainer"): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing icons
    container.innerHTML = "";

    // Get dots for the current category
    const dots = this.getMapDots(categoryId);

    // Create icons for each dot
    dots.forEach(dot => {
      this.addPassengerIconAtPosition(dot.x, dot.y, dot, categoryId, containerId);
    });
  }

  // Add passenger icon at specific position - EXACTLY like plain-map-tracker
  private addPassengerIconAtPosition(x: number, y: number, dot: Dot, categoryId: string, containerId: string = "pulseDotsContainer"): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const iconElement = document.createElement("div");
    iconElement.className = "passenger-icon";

    if (categoryId === "under_age") {
      iconElement.classList.add("child-icon");
    } else if (categoryId === "wheelchair") {
      iconElement.classList.add("wheelchair-icon");
    }

    iconElement.style.position = "absolute";
    iconElement.style.left = `${x}%`;
    iconElement.style.top = `${y}%`;

    // Create the icon content
    const icon = document.createElement("div");
    if (categoryId === "under_age") {
      icon.innerHTML = "👶";
      icon.className = "child-emoji";
    } else if (categoryId === "wheelchair") {
      icon.innerHTML = "♿";
      icon.className = "wheelchair-emoji";
    }

    icon.style.fontSize = "24px";
    icon.style.textAlign = "center";
    icon.style.lineHeight = "28px";
    icon.style.filter = "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))";

    // Store dot data as data attributes
    iconElement.dataset["dotId"] = dot.id.toString();
    iconElement.dataset["categoryId"] = categoryId;

    iconElement.appendChild(icon);

    // Add hover effects - EXACTLY like plain-map-tracker
    iconElement.addEventListener("mouseenter", e => this.showPassengerPopup(e, dot, categoryId));
    iconElement.addEventListener("mouseleave", e => this.hidePassengerPopup());
    iconElement.addEventListener("mousemove", e => this.movePassengerPopup(e));

    container.appendChild(iconElement);
  }

  // Get current category ID from the active tab
  private getCurrentCategoryId(): string {
    // Find the active tab and return its category ID
    const activeTab = document.querySelector(".nav-link.active");
    if (activeTab) {
      const categoryId = activeTab.getAttribute("data-category-id");
      return categoryId || "under_age"; // Default to under_age if not found
    }
    return "under_age";
  }

  // Move passenger popup
  movePassengerPopup(event: MouseEvent): void {
    const popup = document.getElementById("dotPopup");
    if (!popup) return;

    // Get popup dimensions for positioning
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event.clientX + 15;
    let top = event.clientY - 15;

    // Adjust position to prevent cutoff
    if (left + popupRect.width > viewportWidth) {
      left = event.clientX - popupRect.width - 15;
    }

    if (top + popupRect.height > viewportHeight) {
      top = event.clientY - popupRect.height + 15;
    }

    left = Math.max(10, Math.min(left, viewportWidth - popupRect.width - 10));
    top = Math.max(10, Math.min(top, viewportHeight - popupRect.height - 10));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }
}
