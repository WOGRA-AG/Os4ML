import { Component } from '@angular/core';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';

@Component({
  selector: 'app-loader-spinning-planet',
  templateUrl: './loader-spinning-planet.component.html',
  styleUrls: ['./loader-spinning-planet.component.scss'],
  standalone: true,
  imports: [
    LottieComponent
  ]
})
export class LoaderSpinningPlanetComponent {
  public options: AnimationOptions = {
    path: '/assets/lottie/OS4ML-Animation-Logo-v3.json'
  };
}
