import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable, of, switchMap } from 'rxjs';
import {
  ModelmanagerService,
  NewTransferLearningModelDto,
  TransferLearningModel,
} from '../../../build/openapi/modelmanager';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class TransferLearningService {
  private readonly _transferLearningModelsSubject$ = new BehaviorSubject<
    TransferLearningModel[]
  >([]);
  constructor(
    private userService: UserService,
    private modelManager: ModelmanagerService
  ) {
    this.userService.currentToken$
      .pipe(
        // switchMap(token => this.modelManager.getTransferLearningModels(token)),
        switchMap(() => this.mockTransferLearningModels()),
        first()
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
  mockTransferLearningModels(): Observable<TransferLearningModel[]> {
    return of([
      {
        type: 'text',
        name: 'super text',
        id: 'super-text',
        origin: 'Hugging Face',
      },
      {
        type: 'text',
        name: 'super text',
        id: 'super-text',
        origin: 'Own OS4ML model',
      },
      {
        type: 'category',
        name: 'super category',
        id: 'super-category',
        origin: 'Hugging Face',
      },
      {
        type: 'category',
        name: 'mega category',
        id: 'mega-category',
        origin: 'Hugging Face',
      },
      {
        type: 'category',
        name: 'super duper category',
        id: 'super-duper-category',
        origin: 'Hugging Face',
      },
      {
        type: 'category',
        name: 'super text',
        id: 'super-text',
        origin: 'Own OS4ML model',
      },
    ]);
  }
}
