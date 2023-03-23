import { Component, HostBinding, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
  standalone: true,
  imports: [MatIconModule],
})
export class StarComponent {
  @Input() public percentage = 0; // value between 0 and 1

  @HostBinding('style.--percentage') get getPercentage(): number {
    return this.percentage;
  }
}
