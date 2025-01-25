import {  HttpInterceptorFn } from "@angular/common/http";


export const tokenHttpInterceptor:HttpInterceptorFn=(req,next)=>{
   const token=localStorage.getItem("token");

   if(token && token!==undefined && token!=null){
    req=req.clone({
        setHeaders:{
            "Authorization":`Bearer ${token}`
        }
    })
   }
   return next(req);
}