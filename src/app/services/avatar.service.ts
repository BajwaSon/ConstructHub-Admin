// src/app/shared/color-utils.service.ts
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AvatarService {
  private colors = [
    "#FFB6C1",
    "#FFD700",
    "#527ed5",
    "#40E0D0",
    "#FFA07A",
    "#9370DB",
    "#F4A460",
    "#00CED1",
    "#FF6347",
    "#20B2AA",
    "#6495ED",
    "#FF69B4",
    "#8A2BE2",
    "#00FA9A",
    "#DC143C",
    "#7B68EE",
    "#48D1CC",
    "#FF8C00",
    "#00BFFF",
    "#BA55D3",
  ];

  getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.colors.length;
    return this.colors[index];
  }

  getTextColor(bgColor: string): string {
    const color = bgColor.substring(1);
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150 ? "#000000" : "#FFFFFF";
  }
  getInitials(firstName: string | null | undefined, lastName: string | null | undefined): string {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return firstInitial + lastInitial;
  }
  getName(name: string): string {
    if (!name) return ""; // Handle empty names
    const words = name.trim().split(/\s+/); // Split name by spaces
    return words[0].substring(0, 2).toUpperCase(); // Get first 2 letters of the first word
  }
}
