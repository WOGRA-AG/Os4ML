import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
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
