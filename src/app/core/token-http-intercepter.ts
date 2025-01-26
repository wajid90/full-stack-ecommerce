import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const tokenHttpInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem("accessToken");
  const authService = inject(AuthService);
  const router = inject(Router);

  if (token) {
    req = req.clone({
      setHeaders: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          return authService.refreshToken(refreshToken).pipe(
            switchMap((response: any) => {
              localStorage.setItem("accessToken", response.accessToken);
              req = req.clone({
                setHeaders: {
                  "Authorization": `Bearer ${response.accessToken}`
                }
              });
              return next(req);
            }),
            catchError(err => {
              authService.logout();
              router.navigateByUrl("/login");
              return throwError(err);
            })
          );
        } else {
          authService.logout();
          router.navigateByUrl("/login");
        }
      }
      return throwError(error);
    })
  );
};