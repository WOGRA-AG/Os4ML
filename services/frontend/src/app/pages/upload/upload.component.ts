import {Component} from '@angular/core';
import {ObjectstoreService} from "../../../../build/openapi/objectstore";
import {firstValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Bucket} from "../../../../build/openapi/objectstore";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  file: File = new File([], "");
  bucketName: string = "os4ml";

  constructor(private objectStoreService: ObjectstoreService, private http: HttpClient, private router: Router) {
  }

  async updateFile(file: File) {
    const buckets: Bucket[] = await firstValueFrom(this.objectStoreService.getAllBuckets());
    if (!buckets.some(bucket => bucket.name === this.bucketName)) {
      await firstValueFrom(this.objectStoreService.postNewBucket(this.bucketName));
    }
    this.file = file;
    try {
      await firstValueFrom(this.objectStoreService.putObjectByName(this.bucketName, file.name, file));
      await this.router.navigate(['/report']);
    } catch (e) {
      console.log(e);
    }
  }
}
