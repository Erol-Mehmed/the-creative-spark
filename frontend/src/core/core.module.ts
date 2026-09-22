import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { appInterceptorProvider } from './app-interceptors';
import { UploadService } from './services/upload.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [UserService, UploadService, appInterceptorProvider],
})
export class CoreModule {}
