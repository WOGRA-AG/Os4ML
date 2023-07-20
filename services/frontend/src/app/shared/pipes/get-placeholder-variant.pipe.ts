import { Pipe, PipeTransform } from '@angular/core';
import { Databag, Prediction, Solution } from 'build/openapi/modelmanager';
import { PlaceholderVariant } from '../components/organisms/placeholder/placeholder.component';

@Pipe({
  name: 'getPlaceholderVariant',
  standalone: true,
})
export class GetPlaceholderVariantPipe implements PipeTransform {
  transform(
    databags?: Databag[] | null,
    solutions?: Solution[],
    predictions?: Prediction[]
  ): PlaceholderVariant {
    const hasDatabags = !!databags && databags.length > 0;
    const hasSolutions = !!solutions && solutions.length > 0;
    const hasPredictions = !!predictions && predictions.length > 0;

    //when user has no databags
    if (!hasDatabags) {
      return PlaceholderVariant.noData;
    }

    //when user has databags but no solutions
    if (hasDatabags && !hasSolutions) {
      return PlaceholderVariant.noSolution;
    }

    //when user has databags and solutions but no predictions
    if (hasDatabags && hasSolutions && !hasPredictions) {
      return PlaceholderVariant.noPrediction;
    }

    return PlaceholderVariant.noData;
  }
}
