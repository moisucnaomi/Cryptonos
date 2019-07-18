import { Component, OnInit, ViewEncapsulation, ViewChild, Input, ElementRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { IMAGES, FAKE_KEY, ENCRYPTION_INFO } from '../constants';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { ApiService } from '../service/api/api.service';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HTTPStatus } from '../service/error/error-interceptor';

@Component({
  selector: 'app-encryption-page',
  templateUrl: './encryption-page.component.html',
  styleUrls: ['./encryption-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EncryptionPageComponent implements OnInit {
  @ViewChild("inputImage") inputFile : ElementRef;
  public showResult: boolean = false;
  public images: any = IMAGES;
  public currentImageIndex: number = Math.floor(Math.random() * Math.floor(51));
  public key: string = FAKE_KEY;
  public imageFile: any;
  public finalImage: any;
  public finalImageUrl: any;
  public secretMessage: FormControl = new FormControl();
  public fakeImage = "";
  public advanced: boolean = false;
  public encrypt: boolean = true;
  public bits: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public selectedBits: boolean[] = [false, true, true, false, false, false, false, false, false];
  public isLoading = false;
  public hiddenCharacters: number;
  public usedPixels: number;
  public imageWidth: number;
  public imageHeight: number;

  private selectedBitsToSend: number[] = [1, 2];
  private selectedFile: any;

  constructor(public dialog: MatDialog,
    private api: ApiService,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private httpStatus: HTTPStatus) {
      this.httpStatus.getHttpStatus().subscribe((status: boolean) => {this.isLoading = status});
    }

  ngOnInit() {
  }

  public action() {
    if (!this.secretMessage.value) {
      this.openSnackBar('Please provide a message');
      return;
    }
    if (this.advanced) {
      this.selectedBitsToSend = [];
      let i: number;
      for(i = 0; i < this.selectedBits.length; i++ )
        if (this.selectedBits[i]) {
          this.selectedBitsToSend.push(i);
        }
    } else {
      this.selectedBitsToSend = [1, 2];
    }
    if (!this.selectedFile) {
      this.imageToFile();
    }
    else {
      this.sendImage(this.selectedFile);
    }
  }

  private fixBinary (bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  }

  public sendImage(file: File){
    this.httpStatus.setHttpStatus(true);
    this.showResult = false;
    this.api.encrypt(file, this.secretMessage.value, this.selectedBitsToSend, this.encrypt).subscribe(
      (data) => {
        this.showResult = true;
        this.key = data.Key;
        this.finalImage = data.Image;
        this.hiddenCharacters = data.HiddenCharacters;
        this.usedPixels = data.UsedPixels;
        this.imageWidth = data.ImageWidth;
        this.imageHeight = data.ImageHeight;
  
        var binary = this.fixBinary(atob(data.Image));
        var blob = new Blob([binary], {type: 'image/png'});

        this.finalImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
        this.httpStatus.setHttpStatus(false);
      }
    );
  }

  public changeImage() {
    this.imageFile = null;
    this.selectedFile = null;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;    
    this.showResult = false;
    this.inputFile.nativeElement.value = null;
  }

  public uploadImage(files: any) { 
    this.showResult = false;
    this.selectedFile = files[0];
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imageFile = reader.result; 
    }    
  }

  public uploadFile(files: any) { 
    var reader = new FileReader();
    reader.readAsText(files[0]); 
    reader.onload = (_event) => { 
      this.secretMessage.setValue(reader.result);
    }  
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(InfoPopupComponent, {
      width: '485px',
      data: { message: ENCRYPTION_INFO}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, '', {verticalPosition: "top", duration: 5000});
  }

  private imageToFile() {
    let base64: string;
    this.api.getText(this.images[this.currentImageIndex].blobPath).subscribe(
      data => {
        this.fakeImage = data;
        base64 = data;
        const imageBlob = this.dataURItoBlob(base64);
        const imageFile = new File([imageBlob], 'imageName', { type: 'image/png' });
        this.sendImage(imageFile);
      }
    );

  }

  private dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
  }

  advancedSelected() {
    this.selectedBits = [false, true, true, false, false, false, false, false, false];
    this.selectedBitsToSend = [1, 2];
    this.encrypt = true;
  }
}
