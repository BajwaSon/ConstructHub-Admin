/* eslint-disable @angular-eslint/use-lifecycle-interface */

import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RequestLoader } from "@jot143/core-angular";
import { LoaderComponent } from "../../loader/loader.component";

interface UserData {
  name?: string;
  role?: string;
  avatarUrl?: string;
  status?: "online" | "offline" | "inactive";
}

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: "app-health-observation",
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],

  templateUrl: "./health-observation.component.html",
  styleUrl: "./health-observation.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthObservationComponent {
  isSearchVisible = false;
  healthObservationLoader = new RequestLoader();
  private updateInterval: ReturnType<typeof setInterval> | undefined;
  studentHealthData = [
    {
      name: "Sayid Mohammad",
      avatar: "/images/sayid.png",
      condition: "Cough",
      borderColor: "border-warning",
      backgroundColor: "var(--light-orange-bg)",
      strokeColor: "#f1b44c",
      spinnerColor: "text-warning",
      statsIcon: "/images/health-icon/cough-icon.svg",
      stats: [
        { icon: "/images/health-icon/heart-rate.svg", value: "95 Bpm" },
        { icon: "/images/health-icon/body-temperature.svg", value: "36.8°" },
        { icon: "/images/health-icon/bp.svg", value: "120/80" },
        { icon: "/images/health-icon/stress-value.svg", value: "150 psi" },
      ],
    },
    {
      name: "Sufin Brown",
      avatar: "/images/sufin.png",
      condition: "Fever",
      borderColor: "border-danger",
      backgroundColor: "var(--light-red-bg)",
      strokeColor: "#f46a6a",
      spinnerColor: "text-danger",
      statsIcon: "/images/health-icon/fever-icon.svg",
      stats: [
        { icon: "/images/health-icon/heart-rate.svg", value: "88 Bpm" },
        { icon: "/images/health-icon/body-temperature.svg", value: "36.9°" },
        { icon: "/images/health-icon/bp.svg", value: "115/75" },
        { icon: "/images/health-icon/stress-value.svg", value: "180 psi" },
      ],
    },
    {
      name: "Zahra Wilson",
      avatar: "/images/zahra.png",
      condition: "Belly Pain",
      borderColor: "border-warning",
      backgroundColor: "var(--light-orange-bg)",
      strokeColor: "#f1b44c",
      spinnerColor: "text-warning",
      statsIcon: "/images/health-icon/belly-pain-icon.svg",
      stats: [
        { icon: "/images/health-icon/heart-rate.svg", value: "92 Bpm" },
        { icon: "/images/health-icon/body-temperature.svg", value: "36.7°" },
        { icon: "/images/health-icon/bp.svg", value: "118/78" },
        { icon: "/images/health-icon/stress-value.svg", value: "160 psi" },
      ],
    },
    {
      name: "Ayisha Moore",
      avatar: "/images/ayisha.png",
      condition: "Injury",
      borderColor: "border-warning",
      backgroundColor: "var(--light-orange-bg)",
      strokeColor: "#f1b44c",
      spinnerColor: "text-warning",
      statsIcon: "/images/health-icon/injury-icon.svg",
      stats: [
        { icon: "/images/health-icon/heart-rate.svg", value: "110 Bpm" },
        { icon: "/images/health-icon/body-temperature.svg", value: "38.1°" },
        { icon: "/images/health-icon/bp.svg", value: "130/85" },
        { icon: "/images/health-icon/stress-value.svg", value: "200 psi" },
      ],
    },
    {
      name: "Jabir Taylor",
      avatar: "/images/jabir.png",
      condition: "Cough",
      borderColor: "border-danger",
      backgroundColor: "var(--light-red-bg)",
      strokeColor: "#f46a6a",
      spinnerColor: "text-danger",
      statsIcon: "/images/health-icon/cough-icon.svg",
      stats: [
        { icon: "/images/health-icon/heart-rate.svg", value: "94 Bpm" },
        { icon: "/images/health-icon/body-temperature.svg", value: "36.9°" },
        { icon: "/images/health-icon/bp.svg", value: "125/82" },
        { icon: "/images/health-icon/stress-value.svg", value: "190 psi" },
      ],
    },
    {
      name: "Rahman Thomas",
      avatar: "/images/rahman.png",
      condition: "Fever",
      borderColor: "border-danger",
      backgroundColor: "var(--light-red-bg)",
      strokeColor: "#f46a6a",
      spinnerColor: "text-danger",
      statsIcon: "/images/health-icon/fever-icon.svg",
      stats: [
        { icon: "/images/health-icon/heart-rate.svg", value: "115 Bpm" },
        { icon: "/images/health-icon/body-temperature.svg", value: "37.3°" },
        { icon: "/images/health-icon/bp.svg", value: "135/88" },
        { icon: "/images/health-icon/stress-value.svg", value: "220 psi" },
      ],
    },
  ];

  @Input() users: UserData[] = [
    { name: "Sayid", role: "Student", avatarUrl: "/images/sayid.png", status: "online" },
    { name: "Thomas", role: "Student", avatarUrl: "/images/thomas.png", status: "inactive" },
    { name: "Sinan", role: "Student", avatarUrl: "/images/sinan.png", status: "online" },
    { name: "Sufin", role: "Student", avatarUrl: "/images/sufin.png", status: "online" },
    { name: "Devon Lane", role: "Doctor", avatarUrl: "/images/profile-picture.png", status: "inactive" },
    { name: "Kais", role: "Student", avatarUrl: "/images/kais.png", status: "offline" },
    { name: "Rahman", role: "Student", avatarUrl: "/images/rahman.png", status: "online" },
    { name: "Arlene McCoy", role: "Teacher", avatarUrl: "/images/cooper.png", status: "inactive" },
    { name: "Kristin Watson", role: "Teacher", avatarUrl: "/images/simmons.png", status: "offline" },
    { name: "Guy Hawkins", role: "Nurse", avatarUrl: "/images/henry.png", status: "online" },
  ];

  @Input() messages: Message[] = [
    { sender: "You", content: "Hello", timestamp: new Date() },
    { sender: "Sinan", content: "Hi, Mrs. Johnson. This is Nurse Emma from Maple Elementary. I wanted to give you a quick update about Emily.", timestamp: new Date() },
    { sender: "You", content: "Oh, hi, Nurse Emma! Is everything okay?", timestamp: new Date() },
    {
      sender: "Sinan",
      content: "Yes, nothing major. Emily came to the nurse's office today because she said she wasn't feeling well—she had a slight headache and felt a bit tired.",
      timestamp: new Date(),
    },
    { sender: "You", content: "Oh no, did she have a fever or anything?", timestamp: new Date() },
  ];
  searchTerm: string = "";
  filteredUsers: UserData[] = [];
  newMessage: string = "";
  selectedUser: UserData | null = null;
  selectedUserMessages: Message[] = [];

  constructor(private cd: ChangeDetectorRef) {
    this.filteredUsers = [...this.users];
  }
  ngOnInit() {
    if (this.users.length > 0) {
      const selectedUser = this.users[0];
      this.selectUser(selectedUser);
    }
    this.startStatsUpdate();
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private startStatsUpdate() {
    // Update stats every 3 seconds
    this.updateInterval = setInterval(() => {
      this.updateRandomStats();
      this.cd.detectChanges();
    }, 3000);
  }

  private updateRandomStats() {
    this.studentHealthData = this.studentHealthData.map(student => {
      // Get current values with fallback to reasonable defaults
      const currentHeartRate = this.parseNumber(student.stats[0].value, 90);
      const currentTemp = this.parseNumber(student.stats[1].value, 37);
      const currentBp = this.parseBp(student.stats[2].value, [120, 80]);
      const currentStress = this.parseNumber(student.stats[3].value, 180);

      // Calculate new values with small changes
      const newHeartRate = this.getSmallChange(currentHeartRate, 60, 120, 3);
      const newTemp = this.getSmallChange(currentTemp, 36, 38, 0.2);
      const newBpSystolic = this.getSmallChange(currentBp[0], 110, 130, 3);
      const newBpDiastolic = this.getSmallChange(currentBp[1], 70, 85, 2);
      const newStress = this.getSmallChange(currentStress, 150, 250, 5);

      // Update condition based on new values
      let newCondition = "Normal";
      let newBorderColor = "border-success";
      let newBackgroundColor = "var(--light-green-bg)";
      let newStrokeColor = "#34c38f";
      let newSpinnerColor = "text-success";

      if (newTemp > 37.5 || newHeartRate > 110) {
        newCondition = "Danger";
        newBorderColor = "border-danger";
        newBackgroundColor = "var(--light-red-bg)";
        newStrokeColor = "#f46a6a";
        newSpinnerColor = "text-danger";
      } else if (newTemp > 37.2 || newHeartRate > 100) {
        newCondition = "Warning";
        newBorderColor = "border-warning";
        newBackgroundColor = "var(--light-orange-bg)";
        newStrokeColor = "#f1b44c";
        newSpinnerColor = "text-warning";
      }

      return {
        ...student,
        condition: newCondition,
        borderColor: newBorderColor,
        backgroundColor: newBackgroundColor,
        strokeColor: newStrokeColor,
        spinnerColor: newSpinnerColor,
        stats: [
          { icon: "/images/health-icon/heart-rate.svg", value: `${newHeartRate} Bpm` },
          { icon: "/images/health-icon/body-temperature.svg", value: `${newTemp.toFixed(1)}°` },
          { icon: "/images/health-icon/bp.svg", value: `${newBpSystolic}/${newBpDiastolic}` },
          { icon: "/images/health-icon/stress-value.svg", value: `${newStress} psi` },
        ],
      };
    });
    this.cd.detectChanges();
  }

  private parseNumber(value: string, defaultValue: number): number {
    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  }

  private parseBp(value: string, defaultValue: [number, number]): [number, number] {
    const parts = value.split("/");
    if (parts.length !== 2) return defaultValue;

    const systolic = this.parseNumber(parts[0], defaultValue[0]);
    const diastolic = this.parseNumber(parts[1], defaultValue[1]);

    return [systolic, diastolic];
  }

  private getSmallChange(current: number, min: number, max: number, maxChange: number): number {
    // Generate a small random change between -maxChange and +maxChange
    const change = Math.floor(Math.random() * (maxChange * 2 + 1)) - maxChange;
    // Apply the change but ensure we stay within bounds
    return Math.min(Math.max(current + change, min), max);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ sender: "You", content: this.newMessage, timestamp: new Date() });
      this.newMessage = "";
    }
  }
  filterUsers() {
    this.filteredUsers = this.users.filter(user => user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
  selectUser(user: UserData) {
    this.selectedUser = user;
    this.selectedUserMessages = this.messages.filter(message => message.sender === user.name);
  }
}
