import { Component } from '@angular/core';
import { DatabagCreateButtonComponent } from '../../organisms/databag-create-button/databag-create-button.component';
import { Os4mlDefaultTemplateComponent } from '../../templates/os4ml-default-template/os4ml-default-template.component';
import { Solution } from '../../../../../build/openapi/modelmanager';
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import { SolutionDetailInputComponent } from '../../organisms/solution-detail-input/solution-detail-input.component';
import {SolutionDetailOutputComponent} from "../../organisms/solution-detail-output/solution-detail-output.component";
import {HasElementsPipe} from "../../../pipes/has-elements.pipe";
import {
  PredictionCreateButtonComponent
} from "../../organisms/prediction-create-button/prediction-create-button.component";
import {SolutionCreateButtonComponent} from "../../organisms/solution-create-button/solution-create-button.component";
import {
  SolutionDetailDependenciesComponent
} from "../../organisms/solution-detail-dependencies/solution-detail-dependencies.component";
import {
  SolutionDetailDowloadModelComponent
} from "../../organisms/solution-detail-dowload-model/solution-detail-dowload-model.component";
import {
  SolutionDetailDeleteSolutionComponent
} from "../../organisms/solution-detail-delete-solution/solution-detail-delete-solution.component";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-solution-detail-page',
  templateUrl: './solution-detail-page.component.html',
  styleUrls: ['./solution-detail-page.component.scss'],
  standalone: true,
  imports: [
    DatabagCreateButtonComponent,
    Os4mlDefaultTemplateComponent,
    JsonPipe,
    SolutionDetailInputComponent,
    NgIf,
    SolutionDetailOutputComponent,
    NgForOf,
    AsyncPipe,
    HasElementsPipe,
    PredictionCreateButtonComponent,
    SolutionCreateButtonComponent,
    SolutionDetailDependenciesComponent,
    SolutionDetailDowloadModelComponent,
    SolutionDetailDeleteSolutionComponent,
    MatIconModule,
  ],
})
export class SolutionDetailPageComponent {
  public mockPredictions  = [
    'mockPrediction',
    'mockPrediction',
    'mockPrediction',
  ];
  public mockTransferlerningModels = [
    'mockTransferlerningModel',
    'mockTransferlerningModel',
    'mockTransferlerningModel',
  ];
  public mockSolution: Solution = {
    status: 'Created',
    name: 'w3rwr3',
    databagId: '2b72f766-b70a-40dc-bce7-30ec8867d5e8',
    metrics: {
      combined: 0.8194444179534912,
      details: [
        {
          outputField: 'Pclass',
          name: 'accuracy',
          value: 0.6812468767166138,
        },
        {
          outputField: 'Sex',
          name: 'accuracy',
          value: 0.9069766998291016,
        },
        {
          outputField: 'Age',
          name: 'r2_score',
          value: 0.27013349533081055,
        },
      ],
    },
    inputFields: [
      'PassengerId',
      'Pclass',
      'Name',
      'Sex',
      'Age',
      'SibSp',
      'Parch',
      'Ticket',
      'Fare',
      'Cabin',
      'Embarked',
    ],
    outputFields: ['Survived'],
    transferLearningSettings: [
      {
        name: 'PassengerId',
        type: 'numerical',
        selectedTransferLearningModel: {
          name: 'Default Model',
          id: 'default-model',
          type: 'Default',
          origin: 'OS4ML',
        },
      },
      {
        name: 'Pclass',
        type: 'category',
        selectedTransferLearningModel: {
          type: 'category',
          name: 'super category',
          id: 'super-category',
          origin: 'Hugging Face',
        },
      },
      {
        name: 'Name',
        type: 'text',
        selectedTransferLearningModel: {
          name: 'Default Model',
          id: 'default-model',
          type: 'Default',
          origin: 'OS4ML',
        },
      },
      {
        name: 'Sex',
        type: 'category',
        selectedTransferLearningModel: {
          type: 'category',
          name: 'mega category',
          id: 'mega-category',
          origin: 'Hugging Face',
        },
      },
      {
        name: 'Age',
        type: 'numerical',
        selectedTransferLearningModel: {
          name: 'Default Model',
          id: 'default-model',
          type: 'Default',
          origin: 'OS4ML',
        },
      },
      {
        name: 'SibSp',
        type: 'category',
        selectedTransferLearningModel: {
          name: 'Default Model',
          id: 'default-model',
          type: 'Default',
          origin: 'OS4ML',
        },
      },
      {
        name: 'Parch',
        type: 'category',
        selectedTransferLearningModel: {
          name: 'Default Model',
          id: 'default-model',
          type: 'Default',
          origin: 'OS4ML',
        },
      },
      {
        name: 'Ticket',
        type: 'text',
        selectedTransferLearningModel: {
          name: 'Default Model',
          id: 'default-model',
          type: 'Default',
          origin: 'OS4ML',
        },
      },
      {
        name: 'Fare',
        type: 'numerical',
        selectedTransferLearningModel: {
          name: 'Default Model',
          id: 'default-model',
          type: 'Default',
          origin: 'OS4ML',
        },
      },
      {
        name: 'Cabin',
        type: 'text',
        selectedTransferLearningModel: {
          name: 'Default Model',
          id: 'default-model',
          type: 'Default',
          origin: 'OS4ML',
        },
      },
      {
        name: 'Embarked',
        type: 'category',
        selectedTransferLearningModel: {
          name: 'Default Model',
          id: 'default-model',
          type: 'Default',
          origin: 'OS4ML',
        },
      },
    ],
    solver: 'ludwig-solver',
  };
}
