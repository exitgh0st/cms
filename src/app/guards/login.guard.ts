import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, first, firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AccountService } from '../services/account.service';
import { RoleService } from '../services/role.service';
import { RolesEnum } from '../enums/roles-enum';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private roleService: RoleService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isAuth = this.authService.isAuthenticated();
    const accountId = this.authService.getAccountId();

    if (isAuth && accountId) {
      const account$ = this.accountService.getAccount(accountId);

      return firstValueFrom(account$).then((account) => {
        if (!account.role.id) {
          return false;
        }

        const role$ = this.roleService.getRole(account.role.id);

        return firstValueFrom(role$).then((roleData) => {
          if (!roleData.id) {
            return false;
          }

          const role = getEnumFromString(roleData.id.toString());

          switch (role) {
            case RolesEnum.SUPER_ADMIN:
              this.router.navigate(['super-admin', 'dashboard']);
              return false;
            case RolesEnum.CLEARANCE_ADMIN:
              this.router.navigate(['admin', 'dashboard']);
              return false;
            case RolesEnum.STUDENT:
              this.router.navigate(['student', 'dashboard']);
              return false;
            default:
              return true;
          }
        });
      });
    } else {
      return true;
    }
  }
}

function getEnumFromString(value: string): RolesEnum | undefined {
  const enumValues = Object.keys(RolesEnum) as unknown as (keyof typeof RolesEnum)[];
  const enumKey = enumValues.find((key) => RolesEnum[key] === value);
  return enumKey ? RolesEnum[enumKey] : undefined;
}
