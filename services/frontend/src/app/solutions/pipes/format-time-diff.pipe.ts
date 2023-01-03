import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimeDiff'
})
export class FormatTimeDiffPipe implements PipeTransform {

  transform(timeDiffInMs: number | null): string {
    if (!timeDiffInMs) {
      return '';
    }
    // https://stackoverflow.com/a/29816921 with small fixes
    let seconds = timeDiffInMs / 1000;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.round(seconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

}
