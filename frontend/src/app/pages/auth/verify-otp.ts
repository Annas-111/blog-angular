import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
// import { apiClient } from '../../api/service/api-client';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
<div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
  <div class="flex flex-col items-center justify-center">
    <div
      style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"
    >
      <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
        <div class="text-center mb-8">
          <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-16 shrink-0 mx-auto">
            <!-- Keep your SVG logo here -->
          </svg>
          <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Verify Your Email</div>
          <span class="text-muted-color font-medium">Enter the 6-digit code sent to your email</span>
        </div>

        <div class="flex justify-center mb-8">
          <input
            *ngFor="let digit of otpDigits; let i = index"
            type="text"
            maxlength="1"
            class="w-12 h-12 text-center text-xl font-medium border border-gray-300 dark:border-gray-600 rounded-lg mx-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            [(ngModel)]="otp[i]"
            (input)="onOtpInput($event, i)"
          />
        </div>

        <p-button label="Verify" styleClass="w-full" (onClick)="verifyOtp()"></p-button>

        <div class="text-center mt-6 text-sm">
          Didn't receive the code?
          <a (click)="resendOtp()" class="text-primary font-semibold hover:underline cursor-pointer">Resend</a>
        </div>
      </div>
    </div>
  </div>
</div>

    `
})
export class verifyOtp {
    otp: string[] = ['', '', '', '', '', ''];
otpDigits = Array(6).fill(0);

onOtpInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  const value = input.value;
  if (value && index < 5) {
    const next = input.nextElementSibling as HTMLInputElement;
    next?.focus();
  }
}

onOtpBackspace(event: KeyboardEvent, index: number) {
  const input = event.target as HTMLInputElement;

  // Only go back on actual backspace key
  if (event.key === 'Backspace' && !input.value && index > 0) {
    const prev = input.previousElementSibling as HTMLInputElement;
    prev?.focus();
  }
}

verifyOtp() {
  const code = this.otp.join('');
  
}

resendOtp() {
  console.log('Resending OTP...');
  // Add actual resend logic here
}

}
