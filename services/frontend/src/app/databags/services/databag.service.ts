import { Injectable } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { Databag, ModelmanagerService } from '../../../../build/openapi/modelmanager';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';

@Injectable({
  providedIn: 'root'
})
export class DatabagService {

  databags$: Observable<Databag[]>;

  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService) {
    const path = '/apis/v1beta1/model-manager/databags';
    this.databags$ = this.webSocketConnectionService.connect(path).pipe(
      map(data => data as Databag[]),
      tap(bags => console.log('databags', bags)),
    );
  }

  getDatabagsSortByCreationTime(): Observable<Databag[]> {
    const sortByCreationTime = (databag1: Databag, databag2: Databag) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const date1 = new Date(databag1.creationTime!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const date2 = new Date(databag2.creationTime!);
      return date2.getTime() - date1.getTime();
    };

    return this.databags$.pipe(
      map(databags => databags.sort(sortByCreationTime))
    );
  }

  getDatabagById(id: string): Observable<Databag> {
    return this.databags$.pipe(
      map(databags => databags.filter(databag => databag.databagId === id)),
      filter(databags => databags.length > 0),
      map(databags => databags[0]),
    );
  }

  createDatabag(databag: Databag): Observable<Databag> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.createDatabag(token, databag))
    );
  }

  deleteDatabagById(id: string): Observable<void> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.deleteDatabagById(id, token))
    );
  }

  updateDatabagById(id: string, databag: Databag): Observable<Databag> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.updateDatabagById(id, token, databag))
    );
  }

  uploadDataset(id: string, file: Blob): Observable<void> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.uploadDataset(id, token, file))
    );
  }

  isSameDatabag(databag1: Databag, databag2: Databag): boolean {
    return JSON.stringify(databag1) === JSON.stringify(databag2);
  }
}
