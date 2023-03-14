import { filter, map, Observable } from 'rxjs';

export const filterNotDefined =
  () =>
  <T>(source: Observable<T | null | undefined>): Observable<T> =>
    source.pipe(
      filter(val => val !== undefined && val !== null),
      map(val => val!)
    );
