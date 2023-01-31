import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
})
export class FormatNumberPipe implements PipeTransform {
  transform(input: number, nDecimals = 2): string {
    return input.toFixed(nDecimals);
  }
}
