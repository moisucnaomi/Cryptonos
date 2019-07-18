import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyOwnMaterialsModule } from './modules/my-own-materials/my-own-materials.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DecryptionPageComponent } from './decryption-page/decryption-page.component';
import { EncryptionPageComponent } from './encryption-page/encryption-page.component';
import { InfoPopupComponent } from './info-popup/info-popup.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiService } from './service/api/api.service';
import { ErrorInterceptor, HTTPStatus } from './service/error/error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DecryptionPageComponent,
    EncryptionPageComponent,
    InfoPopupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MyOwnMaterialsModule,
    HttpClientModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ApiService,
    HTTPStatus
    ],
  entryComponents: [
    InfoPopupComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
