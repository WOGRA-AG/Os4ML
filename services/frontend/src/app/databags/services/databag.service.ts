import { Injectable } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { filter, map, Observable, switchMap } from 'rxjs';
import {
  Databag,
  ModelmanagerService,
} from '../../../../build/openapi/modelmanager';
import { WebSocketConnectionService } from 'src/app/core/services/web-socket-connection.service';
import { sortByCreationTime } from 'src/app/shared/lib/sort/sort-by-creation-time';

@Injectable({
  providedIn: 'root',
})
export class DatabagService {
  private readonly _databags$: Observable<Databag[]>;

  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService
  ) {
    const path = '/apis/v1beta1/model-manager/databags';
    this._databags$ = this.webSocketConnectionService.connect(path);
  }

  get databags$(): Observable<Databag[]> {
    return this._databags$;
  }

  getDatabagsSortByCreationTime(): Observable<Databag[]> {
    return this.databags$.pipe(
      map(databags => databags.sort(sortByCreationTime))
    );
  }

  getDatabagById(id: string): Observable<Databag> {
    return this.databags$.pipe(
      map(databags => databags.filter(databag => databag.databagId === id)),
      filter(databags => databags.length > 0),
      map(databags => databags[0])
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
      switchMap(token =>
        this.modelManager.updateDatabagById(id, token, databag)
      )
    );
  }

  uploadDataset(id: string, file: Blob): Observable<void> {
    return this.userService.currentToken$.pipe(
      switchMap(token => this.modelManager.uploadDataset(id, token, file))
    );
  }

  isSameDatabag(databag1: Databag, databag2: Databag): boolean {
    return databag1.databagId === databag2.databagId;
  }
}
