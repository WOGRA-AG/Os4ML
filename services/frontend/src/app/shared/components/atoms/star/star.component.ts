import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
})
export class StarComponent {
  @Input() public percentage = 0; // value between 0 and 1

  @HostBinding('style.--percentage') get getPercentage(): number {
    return this.percentage;
  }
}
