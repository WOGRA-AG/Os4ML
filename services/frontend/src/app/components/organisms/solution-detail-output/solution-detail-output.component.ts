import { Component, Input } from '@angular/core';
import { Metric } from '../../../../../build/openapi/modelmanager';
import { MatTableModule } from '@angular/material/table';
import {StarRatingComponent} from "../../molecules/star-rating/star-rating.component";

@Component({
  selector: 'app-solution-detail-output',
  templateUrl: './solution-detail-output.component.html',
  styleUrls: ['./solution-detail-output.component.scss'],
  standalone: true,
  imports: [MatTableModule, StarRatingComponent],
})
export class SolutionDetailOutputComponent {
  @Input() public combined = 0;
  @Input() public details: Metric[] = [];

  public displayedColumns: string[] = ['outputField', 'name', 'value'];
}
