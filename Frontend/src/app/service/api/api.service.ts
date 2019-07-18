import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {

  private baseUrl= 'http://localhost:52936/steganography';

  constructor(private http: HttpClient) { }

  decrypt(fileToUpload: File, key: string, selectedBits: number[], decrypt: boolean): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, fileToUpload.name);
    formData.append('SecretKey', key);
    formData.append('SelectedBits', selectedBits.toString());
    formData.append('Decrypt', decrypt.toString());
    return this.http
      .post(this.baseUrl + '/decrypt', formData);
  }

  encrypt(fileToUpload: File, message: string, selectedBits: number[], encrypt: boolean): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, "imageName");
    formData.append('Message', message);
    formData.append('SelectedBits', selectedBits.toString());
    formData.append('Encrypt', encrypt.toString());
    return this.http
      .post(this.baseUrl + '/encrypt', formData);
  }

  getText(path: string): Observable<any> {
    return this.http.get<any>(path, {responseType: 'text' as 'json'});
  }
}
