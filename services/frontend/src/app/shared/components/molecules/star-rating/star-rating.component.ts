import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
})
export class StarRatingComponent implements OnInit {
  @Input() rating = 0; // value between 0 and 1
  @Input() ratingName: string | undefined;
  @Input() numberStars = 5;
  percentages: number[] = [];

  ngOnInit(): void {
    this.percentages = Array.from(Array(this.numberStars), (_, index) =>
      Math.max(0, Math.min(1, this.rating * this.numberStars - index))
    );
  }
}
