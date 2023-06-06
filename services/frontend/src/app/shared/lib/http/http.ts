import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export const putFileAsOctetStream = (
  http: HttpClient,
  url: string,
  file: File
): Observable<any> => {
  const headers = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/octet-stream',
  });
  return http.put(url, file, { headers });
};
