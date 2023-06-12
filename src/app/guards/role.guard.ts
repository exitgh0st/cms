import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AccountService } from '../services/account.service';
import { RoleService } from '../services/role.service';
import { RolesEnum } from '../enums/roles-enum';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private roleService: RoleService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const roleString = route.data['role'];

    const isAuth = this.authService.isAuthenticated();
    const accountId = this.authService.getAccountId();

    console.log(roleString);

    if (isAuth && accountId) {
      const account$ = this.accountService.getAccount(accountId);

      return firstValueFrom(account$).then((account) => {
        if (!account?.role?.id) {
          return false;
        }

        const role$ = this.roleService.getRole(account.role.id);

        return firstValueFrom(role$).then((roleData) => {
          if (!roleData.name) {
            return false;
          }

          if (roleString === roleData.name) {
            return true;
          }

          this.router.navigate([roleData.name, 'dashboard']);
          return false;
        });
      });
    } else {
      return false;
    }
  }
}
