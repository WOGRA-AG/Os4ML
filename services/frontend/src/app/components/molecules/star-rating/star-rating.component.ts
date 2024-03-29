import { Component, Input, OnInit } from '@angular/core';
import { FormatNumberPipe } from '../../../pipes/format-number.pipe';
import { StarComponent } from '../../atoms/star/star.component';
import { NgFor } from '@angular/common';
import { MaterialModule } from 'src/app/components/atoms/material/material.module';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  standalone: true,
  imports: [MaterialModule, NgFor, StarComponent, FormatNumberPipe],
})
export class StarRatingComponent implements OnInit {
  @Input() public rating = 0; // value between 0 and 1
  @Input() public ratingName: string | undefined;
  @Input() public numberStars = 5;
  public percentages: number[] = [];

  ngOnInit(): void {
    this.percentages = Array.from(Array(this.numberStars), (_, index) =>
      Math.max(0, Math.min(1, this.rating * this.numberStars - index))
    );
  }
}
