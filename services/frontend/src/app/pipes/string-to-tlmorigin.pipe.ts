import { Pipe, PipeTransform } from '@angular/core';
import { TransferLearningModelOrigins } from '../models/transfer-learning-model-origins';

@Pipe({
  name: 'stringToTLMOrigin',
  standalone: true,
})
export class StringToTLMOriginPipe implements PipeTransform {
  transform(
    value: string | undefined
  ): TransferLearningModelOrigins | undefined {
    return (
      TransferLearningModelOrigins[
        value as keyof typeof TransferLearningModelOrigins
      ] || undefined
    );
  }
}
