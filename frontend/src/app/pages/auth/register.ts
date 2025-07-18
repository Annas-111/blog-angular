import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { ApiClientService } from '../../api/service/api-client';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../api/service/authState.service';
import { UserStateService } from '../../api/service/userState.service';

@Component({
    selector: 'app-register',
    standalone: true,
    providers: [ApiClientService],
    imports: [
        RouterModule,
        CommonModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        AppFloatingConfigurator,
    ],
    template: `
    <app-floating-configurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">

            <!-- Conditional UI -->
            <ng-container *ngIf="!otpSent(); else otpVerification">
              <div class="text-center mb-8">
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-16 shrink-0 mx-auto">
                  <!-- Keep your SVG logo here -->
                </svg>
                <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create Your Account</div>
                <span class="text-muted-color font-medium">Register to get started</span>
              </div>

              <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Full Name</label>
              <input pInputText id="name" type="text" placeholder="Your full name" class="w-full md:w-[30rem] mb-8" [(ngModel)]="fullName" />

              <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
              <input pInputText id="email" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

              <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                <div class="flex items-center">
                  <p-checkbox [(ngModel)]="agree" id="terms" binary class="mr-2"></p-checkbox>
                  <label for="terms">I agree to the Terms</label>
                </div>
              </div>
              <p-button label="Register" styleClass="w-full" [disabled]="otpLoading()" [loading]="otpLoading()" (onClick)="register()"></p-button>

              <div class="text-center mt-6 text-sm">
                Already have an account?
                <a routerLink="/login" class="text-primary font-semibold hover:underline">Sign In</a>
              </div>
            </ng-container>

            <!-- OTP Verification UI -->
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

              <p-button label="Verify" styleClass="w-full" [disabled]="verifyLoading()" [loading]="verifyLoading()" (onClick)="verifyOtp()"></p-button>

              <div class="text-center mt-6 text-sm">
                Didn't receive the code?
                <a (click)="resendOtp()" class="text-primary font-semibold hover:underline cursor-pointer">Resend</a>
              </div>
            </ng-template>

          </div>
        </div>
      </div>
    </div>
  `
})
export class Register {
    fullName = '';
    email = '';
    agree = false;

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
                console.log('OTP sent! Show OTP input...');
            }
        });
    }

    register() {
        if (!this.agree) {
            alert('Please agree to the terms');
            return;
        }

        this.otpLoading.set(true); // Start loading

        this.apiClient.register(this.email, this.fullName).subscribe({
            next: () => this.otpSent.set(true),
            error: err => alert('Failed to send OTP: ' + (err.error?.message || err.message)),
            complete: () => this.otpLoading.set(false) // Stop loading
        });
    }


    verifyOtp() {
        const combinedOtp = this.otp.join('');
        if (!combinedOtp || combinedOtp.length !== 6) {
            alert('Please enter the 6-digit OTP');
            return;
        }

        this.verifyLoading.set(true); // Start loading

        this.apiClient.verifyOtp(this.email, combinedOtp).subscribe({
            next: res => {
                this.authState.setToken(res.access_token);
                this.userState.setUser(res.user);
                alert('Verification successful!');
                this.router.navigate(['/']);
            },
            error: err => {
                alert('Verification failed: ' + (err.error?.message || err.message));
            },
            complete: () => {
                this.verifyLoading.set(false); // Stop loading
            }
        });
    }


    onOtpInput(event: any, index: number) {
        const value = event.target.value;
        if (/^\d$/.test(value)) {
            this.otp[index] = value;
            if (index < 5) {
                const nextInput = event.target.nextElementSibling;
                if (nextInput) nextInput.focus();
            }
        } else {
            this.otp[index] = '';
        }
    }

    resendOtp() {
        this.apiClient.register(this.email, this.fullName).subscribe({
            next: () => alert('OTP resent successfully!'),
            error: err => alert('Resend failed: ' + (err.error?.message || err.message)),
        });
    }
}
