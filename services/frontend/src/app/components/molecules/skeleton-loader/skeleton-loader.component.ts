import { Component } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
})
export class SkeletonLoaderComponent {
  public theme = {
    background: 'var(--md-sys-color-surface-container)',
    height: '26px',
    margin: '0px',
  };
}
