import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class HTTPStatus {
  private request$: BehaviorSubject<boolean>;
  constructor() {
    this.request$ = new BehaviorSubject(false);
  }

  setHttpStatus(loading: boolean) {
    this.request$.next(loading);
  }

  getHttpStatus(): Observable<boolean> {
    return this.request$.asObservable();
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private snackBar: MatSnackBar,
        private status: HTTPStatus) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 400) {
                this.openSnackBar(err.error.Message);
            }

            else if (err.status === 500) {
                this.openSnackBar('Make sure your key or selected bits are correct');
            }

            else {
                this.openSnackBar("UPS! Something went wrong! ");
            }
            this.status.setHttpStatus(false);
            return new Observable<never>();
        }))
    }

    private openSnackBar(message: string) {
        this.snackBar.open(message, '', {verticalPosition: "top", duration: 6000});
      }
}