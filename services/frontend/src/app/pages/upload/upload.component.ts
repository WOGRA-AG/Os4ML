import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  file: File = new File([], "");

  constructor() { }

  updateFile(file: File) {
    this.file = file;
    console.log(this.file);
  }
}
