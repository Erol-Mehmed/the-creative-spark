import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const Api_Url = environment.apiUrl;

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith('/api')) {
      const token = localStorage.getItem('access_token');

      const headers: { [name: string]: string } = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return next.handle(
        req.clone({
          url: req.url.replace('/api', Api_Url),
          withCredentials: false,
          setHeaders: headers,
        }),
      );
    }

    return next.handle(req);
  }
}

export const appInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AppInterceptor,
  multi: true,
};
