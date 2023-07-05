import { Pipe, PipeTransform } from '@angular/core';
import { Prediction } from '../../../../build/openapi/modelmanager';

@Pipe({
  name: 'filterPredictionsBySoluitonIdAndDatabagId',
  standalone: true,
})
export class FilterPredictionsBySoluitonIdAndDatabagIdPipe
  implements PipeTransform
{
  transform(
    predictions?: Prediction[] | null,
    databagId?: string | null,
    solutionId?: string | null
  ): Prediction[] {
    if (!predictions) {
      return [];
    }
    let result = predictions;
    // if (databagId) {
    //   result = result.filter(prediction => prediction.databagId === databagId);
    // }
    if (solutionId) {
      result = result.filter(
        prediction => prediction.solutionId === solutionId
      );
    }
    return result;
  }
}
