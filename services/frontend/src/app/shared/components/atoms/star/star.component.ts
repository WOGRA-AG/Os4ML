import { Component, HostBinding, Input } from '@angular/core';
import { MaterialModule } from 'src/app/shared/components/atoms/material/material.module';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
  standalone: true,
  imports: [MaterialModule],
})
export class StarComponent {
  @Input() public percentage = 0; // value between 0 and 1

  @HostBinding('style.--percentage') get getPercentage(): number {
    return this.percentage;
  }
}
