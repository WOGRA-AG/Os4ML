import {Component} from '@angular/core';
import {JobmanagerService} from "../../../../build/openapi/jobmanager";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {v4 as uuidv4} from 'uuid';
import {ObjectstoreService} from "../../../../build/openapi/objectstore";

@Component({
  selector: 'app-upload-solver-page',
  templateUrl: './upload-solver-page.component.html',
  styleUrls: ['./upload-solver-page.component.scss']
})
export class UploadSolverPageComponent {
  bucketName: string = "os4ml";

  constructor(private jobmanagerService: JobmanagerService, private objectstoreService: ObjectstoreService,
              private http: HttpClient, private router: Router) {
  }

  async updateFile(file: File) {
    const uuid: string = uuidv4();
    const createExperiment = {name: `experiment_${uuid}`, description: `desc_${uuid}`};
    const file_url: string = 'http://os4ml-objectstore-manager.os4ml.svc.cluster.local:8000/apis/v1beta1/objectstore/os4ml/object/pipeline.yaml'
    const pipe = {
      name: `pipeline_${uuid}`,
      description: `desc_${uuid}`,
      config_url: `${file_url}`
    }
    const run = {
      name: `run_${uuid}`,
      description: `desc_${uuid}`,
      params: {bucket: 'os4ml', file_name: 'titanic.xlsx'}
    }
    try {
      await firstValueFrom(this.objectstoreService.putObjectByName(this.bucketName, file.name, file));
      const exp_id: string = await firstValueFrom(this.jobmanagerService.postExperiment(createExperiment));
      const pipe_id: string = await firstValueFrom(this.jobmanagerService.postPipeline(pipe));
      const run_id: string = await firstValueFrom(this.jobmanagerService.postRun(exp_id, pipe_id, run));

      await this.router.navigate(['report']);
    } catch (e) {
      console.log(e);
    }
  }
}
