import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
})
export class StarComponent {
  @Input() percentage = 0; // value between 0 and 1

  constructor() {}

  @HostBinding('style.--percentage') get getPercentage() {
    return this.percentage;
  }
}
