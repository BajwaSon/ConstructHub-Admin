import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "app-rating",
  imports: [],
  templateUrl: "./rating.component.html",
  styleUrl: "./rating.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  @Input() rating: number = 0;
  @Input() label: string = "";

  get fullStars() {
    const validRating = Math.max(0, Math.min(5, this.rating));
    return Array(Math.floor(validRating)).fill(0);
  }

  get halfStar() {
    const validRating = Math.max(0, Math.min(5, this.rating));
    return validRating % 1 !== 0;
  }

  get emptyStars() {
    const validRating = Math.max(0, Math.min(5, this.rating));
    const emptyCount = 5 - Math.ceil(validRating);
    return Array(Math.max(0, emptyCount)).fill(0);
  }
}
