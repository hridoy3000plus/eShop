import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  private initializeForms() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^[a-zA-Z ]*$'),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,}$'
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        policy: [false, Validators.requiredTrue],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  hasError(controlName: string, errorName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return control?.errors?.[errorName] ?? false;
  }

  isFieldInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.get(controlName);
    return !!control?.errors && (control?.touched || this.submitted);
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  getControl(controlName: string, form: FormGroup): AbstractControl | null {
    return form.get(controlName);
  }

  onSubmit() {
    this.submitted = true;

    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        const { email, password } = this.loginForm.value;
        if (this.authService.login(email, password)) {
          this.toastService.show('Login successful!', 'success');
          const redirectUrl = this.authService.redirectUrl || '/';
          this.router.navigate([redirectUrl]);
        } else {
          this.toastService.show('Invalid credentials', 'error');
        }
      }
    } else {
      if (this.registerForm.valid) {
        if (this.authService.register(this.registerForm.value)) {
          this.toastService.show(
            'Registration successful! Please login.',
            'success'
          );
          this.isLoginMode = true;
          this.submitted = false;
          this.loginForm.reset();
        } else {
          this.toastService.show(
            'Registration failed. Please try again.',
            'error'
          );
        }
      }
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.submitted = false;
    this.loginForm.reset();
    this.registerForm.reset();
  }
}
