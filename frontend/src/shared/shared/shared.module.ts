import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormatDatePipe } from '../pipes/format-date.pipe';

@NgModule({
  declarations: [FormatDatePipe],
  imports: [CommonModule],
  exports: [FormatDatePipe],
  providers: [DatePipe],
})
export class SharedModule {}
