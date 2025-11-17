import { Directive, ElementRef, Input, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";

@Directive({
  selector: "[appProfilePhoto]",
})
export class ProfilePhotoDirective implements OnInit {
  @Input() appProfilePhoto: string = "";

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setProfilePhoto();
  }

  private setProfilePhoto() {
    const baseUrl = environment.assetsUrl; // Ensure this exists in your environment file

    // Check if the value is already a full URL or needs the base URL prepended
    const imageUrl = this.appProfilePhoto.startsWith("http") ? this.appProfilePhoto : `${baseUrl}/${this.appProfilePhoto}`;

    // Apply the background image
    this.el.nativeElement.style.backgroundImage = `url('${imageUrl}')`;
    this.el.nativeElement.style.backgroundSize = "cover";
    this.el.nativeElement.style.backgroundPosition = "center";
  }
}
