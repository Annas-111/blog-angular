import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { ApiClientService } from '../../api/service/api-client';
import { AuthStateService } from '../../api/service/authState.service';
import { AuthResponse } from '../../types/types';
import { UserStateService } from '../../api/service/userState.service';

@Component({
    selector: 'app-login',
    standalone: true,
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        RippleModule,
        AppFloatingConfigurator,
    ],
    template: `
    <app-floating-configurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">

            <ng-container *ngIf="!otpSent(); else otpVerification">
              <div class="text-center mb-8">
                <svg viewBox="0 0 54 40" class="mb-8 w-16 shrink-0 mx-auto"></svg>
                <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Login to Your Account</div>
                <span class="text-muted-color font-medium">We'll send a 6-digit OTP to your email</span>
              </div>

              <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
              <input pInputText id="email" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

              <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                <div class="flex items-center">
                  <p-checkbox [(ngModel)]="rememberMe" id="rememberme" binary class="mr-2"></p-checkbox>
                  <label for="rememberme">Remember me</label>
                </div>
                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
              </div>

              <p-button label="Send OTP" styleClass="w-full" [disabled]="otpLoading()" [loading]="otpLoading()" (onClick)="sendOtp()"></p-button>

              <div class="text-center mt-6 text-sm">
                Don't have an account?
                <a routerLink="/auth/register" class="text-primary font-semibold hover:underline">Register</a>
              </div>
            </ng-container>

            <ng-template #otpVerification>
              <div class="text-center mb-8">
                <div class="text-3xl font-medium mb-4">Verify Your Email</div>
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

              <p-button label="Verify OTP" styleClass="w-full" [disabled]="verifyLoading()" [loading]="verifyLoading()" (onClick)="verifyOtp()"></p-button>

              <div class="text-center mt-6 text-sm">
                Didn't receive the code?
                <a (click)="resendOtp()" class="text-primary font-semibold hover:underline cursor-pointer">Resend</a>
              </div>
            </ng-template>

          </div>
        </div>
      </div>
    </div>
  `,
})
export class Login {
    email: string = '';
    rememberMe: boolean = false;

    otpSent = signal(false);
    otp: string[] = Array(6).fill('');
    otpDigits = Array(6).fill(0);
    otpLoading = signal(false);
    verifyLoading = signal(false);// for verify otp

    constructor(
        public apiClient: ApiClientService,
        public authState: AuthStateService,
        private userState: UserStateService,
        private router: Router,
    ) {
        effect(() => {
            if (this.otpSent()) {
                console.log('OTP view activated');
            }
        });
    }

    //   to send the otp code
    sendOtp() {
        if (!this.email) {
            alert('Please enter your email');
            return;
        }

        this.otpLoading.set(true);

        this.apiClient.login(this.email).subscribe({
            next: () => {
                this.otpSent.set(true);
            },
            error: err => {
                alert('Failed to send OTP: ' + (err.error?.message || err.message));
            },
            complete: () => {
                this.otpLoading.set(false);
            }
        });
    }


    //   to verify the otp code
    verifyOtp() {
        const combinedOtp = this.otp.join('');
        if (combinedOtp.length !== 6) {
            alert('Please enter the full 6-digit OTP');
            return;
        }

        this.verifyLoading.set(true); // Start loading

        this.apiClient.verifyOtp(this.email, combinedOtp).subscribe({
            next: (res: AuthResponse) => {
                this.authState.setToken(res.access_token);
                this.userState.setUser(res.user);
                alert('Verification successful!');
                setTimeout(() => this.router.navigate(['/']), 0);
            },
            error: err => {
                alert('Verification failed: ' + (err.error?.message || err.message));
            },
            complete: () => {
                this.verifyLoading.set(false); // Stop loading
            }
        });
    }


    resendOtp() {
        this.sendOtp(); // reuse sendOtp logic
    }

    onOtpInput(event: any, index: number) {
        const value = event.target.value;
        if (/^\d$/.test(value)) {
            this.otp[index] = value;
            const next = event.target.nextElementSibling;
            if (next) next.focus();
        } else {
            this.otp[index] = '';
        }
    }
}
