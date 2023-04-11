import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-data-insight-item',
  templateUrl: './data-insight-item.component.html',
  styleUrls: ['./data-insight-item.component.scss'],
  standalone: true,
})
export class DataInsightItemComponent {
  @Input() public title = '';

}
