import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-back-button",
  imports: [],
  templateUrl: "./back-button.component.html",
  styleUrl: "./back-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  @Output() clicked = new EventEmitter();

  onClick() {
    this.clicked.emit();
  }
}
