import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    if (user) {
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(user.role) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/home']);
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to username page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
