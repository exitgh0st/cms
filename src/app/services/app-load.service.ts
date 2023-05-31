import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppLoadService {
  constructor(private authService: AuthService) {}

  async initializeApp() {
    return await this.authService.autoLogin();
  }
}
