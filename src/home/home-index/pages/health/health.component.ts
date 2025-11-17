import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BaseComponent, coreSignal } from "@jot143/core-angular";
import { HealthGraphCardComponent } from "./health-graph-card/health-graph-card.component";

@Component({
  selector: "app-health",
  imports: [HealthGraphCardComponent],
  templateUrl: "./health.component.html",
  styleUrl: "./health.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthComponent extends BaseComponent {
  title = "Health";
  @Input() subjectsOptionShow = coreSignal(false);
  @Input() classLevelId = coreSignal<string | number>("");
  @Input() classSectionId = coreSignal<string | number>("");
}
