import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concatWith,
  first,
  Observable,
  raceWith,
  switchMap,
} from 'rxjs';
import {
  ModelmanagerService,
  NewTransferLearningModelDto,
  TransferLearningModel,
} from '../../../build/openapi/modelmanager';
import { UserService } from './user.service';
import { WebSocketConnectionService } from './web-socket-connection.service';
import { transferLearningWebsocketPath } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransferLearningService {
  private readonly _transferLearningModelsSubject$ = new BehaviorSubject<
    TransferLearningModel[]
  >([]);
  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService,
    private webSocketConnectionService: WebSocketConnectionService
  ) {
    const webSocketConnection$ = this.webSocketConnectionService.connect(
      transferLearningWebsocketPath
    );
    this.userService.currentToken$
      .pipe(
        switchMap(token => this.modelManager.getTransferLearningModels(token)),
        first(),
        concatWith(webSocketConnection$),
        raceWith(webSocketConnection$)
      )
      .subscribe(transferLearningModel =>
        this._transferLearningModelsSubject$.next(transferLearningModel)
      );
  }
  get transferLearningModels$(): Observable<TransferLearningModel[]> {
    return this._transferLearningModelsSubject$.asObservable();
  }
  createTransferLearningModel(
    newTransferLearningModelDto: NewTransferLearningModelDto
  ): Observable<TransferLearningModel> {
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.createNewTransferLearningModelFromSolution(
          token,
          newTransferLearningModelDto
        )
      )
    );
  }
  getTransferLearningModelById$(id: string): Observable<TransferLearningModel> {
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.getTransferLearningModelById(id, token)
      )
    );
  }
  deleteTransferLearningModelById(id: string): Observable<void> {
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.deleteTransferLearningModelById(id, token)
      )
    );
  }

  updateTransferLearningModelById(
    id: string,
    transferLearningModel: TransferLearningModel
  ): Observable<TransferLearningModel> {
    return this.userService.currentToken$.pipe(
      switchMap(token =>
        this.modelManager.updateTransferLearningModelById(
          id,
          token,
          transferLearningModel
        )
      )
    );
  }
}
