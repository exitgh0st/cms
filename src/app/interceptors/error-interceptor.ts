import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401 || error.status == 402) {
          return throwError(() => error);
        }

        let errorMessage = 'An unknown error occurred!';

        if (error.message) {
          errorMessage = error.message;
        }
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        alert(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
