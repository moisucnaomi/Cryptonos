import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { DECRYPTION_INFO, ENCRYPTION_INFO } from '../constants';
import { ApiService } from '../service/api/api.service';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HTTPStatus } from '../service/error/error-interceptor';

@Component({
  selector: 'app-decryption-page',
  templateUrl: './decryption-page.component.html',
  styleUrls: ['./decryption-page.component.scss']
})
export class DecryptionPageComponent implements OnInit {
  public showResult: boolean = false;
  public imageFile: any;
  public fakeMessage: string = ENCRYPTION_INFO;
  public keyControl: FormControl = new FormControl();
  public message: any;
  public fileUrl: any;
  public advanced: boolean = false;
  public decrypt: boolean = true;
  public bits: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public selectedBits: boolean[] = [false, true, true, false, false, false, false, false, false];
  public isLoading = false;

  private selectedFile: File;
  private selectedBitsToSend: number[] = [1, 2];

  constructor(public dialog: MatDialog,
    private api: ApiService,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private httpStatus: HTTPStatus) {
      this.httpStatus.getHttpStatus().subscribe((status: boolean) => {this.isLoading = status});
    }

  ngOnInit() {
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

  public action() {
    if (!this.selectedFile) {
      this.openSnackBar('Please provide an image');
      return;
    }
    if (!this.keyControl.value && this.decrypt) {
      this.openSnackBar('Please provide a key');
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
    this.httpStatus.setHttpStatus(true);
    this.showResult = false;
    this.api.decrypt(this.selectedFile, this.keyControl.value, this.selectedBitsToSend, this.decrypt).subscribe(
      (data) => {
        this.message = data;
        this.showResult = true;

        const blob = new Blob([data], { type: 'application/octet-stream' });
        this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
        this.httpStatus.setHttpStatus(false);
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InfoPopupComponent, {
      width: '485px',
      data: { message: DECRYPTION_INFO}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {verticalPosition: "top", duration: 5000});
  }

  advancedSelected() {
    this.selectedBits = [false, true, true, false, false, false, false, false, false];
    this.selectedBitsToSend = [1, 2];
    this.decrypt = true;
  }
}
