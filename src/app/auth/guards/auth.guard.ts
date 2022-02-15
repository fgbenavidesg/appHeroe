import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanLoad, CanActivate {

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>  | Promise<boolean> | boolean {
      return this.authService.verificaAutenticacion()
      .pipe(
          tap(estaAutenticado=>{
              if(!estaAutenticado){
                this.router.navigate(['./auth/login'])
              }
          })
      )
  }
  constructor(private authService: AuthService,private router : Router){

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.verificaAutenticacion()
    .pipe(
      tap(estaAutenticado=>{
          if(!estaAutenticado){
            this.router.navigate(['./auth/login'])
          }
      })
  )
  }
}