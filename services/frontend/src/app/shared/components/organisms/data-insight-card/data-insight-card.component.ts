import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {CardComponent} from "../../atoms/card/card.component";

@Component({
  selector: 'app-data-insight-card',
  templateUrl: './data-insight-card.component.html',
  styleUrls: ['./data-insight-card.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    CardComponent
  ]
})
export class DataInsightCardComponent {

}
