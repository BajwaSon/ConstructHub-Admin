import { ClassDecorator, Model } from "@jot143/core-angular";
import { Classroom } from "./ClassRoom";
import { Floor } from "./Campus";
import { MarkerMatrix } from "./MarkerMatrix";

export class Gateway extends Model<Gateway> {
  override className: string = "Gateway";
  id = "";
  macId = "";
  latitude = "";
  longitude = "";

  floorId: number | null = null;
  classRoomId: number | null = null;

  @ClassDecorator(() => new Classroom())
  classRoom: Classroom | null = null;

  @ClassDecorator(() => new Floor())
  floor: Floor | null = null;

  @ClassDecorator(() => new MarkerMatrix())
  markerMatrix: MarkerMatrix | null = null;

  campusId: number | null = null;
  buildingId: number | null = null;

  selected = false;
  lastSeen = "";
  createdAt = "";
  updatedAt = "";
  deletedAt: string | null = null;

  get getStatus() {
    // Check if gateway has lastSeen timestamp
    if (!this.lastSeen) {
      return { status: "offline", text: "Offline" };
    }

    // Calculate time difference
    const lastSeen = new Date(this.lastSeen);
    const now = new Date();
    const timeDifferenceInMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);

    // If lastSeen is older than 5 minutes, show offline
    if (timeDifferenceInMinutes > 5) {
      return { status: "offline", text: "Offline" };
    }

    return { status: "online", text: "Online" };
  }
}
