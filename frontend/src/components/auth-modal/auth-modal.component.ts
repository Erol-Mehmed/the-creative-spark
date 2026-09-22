import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhiteSpaceValidator } from '../../shared/whitespace.validator';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent implements OnInit {
  @Input() modalVersion: string | undefined;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  registerForm!: FormGroup;
  loginForm!: FormGroup;
  loginOrRegister = {
    title: '',
    signupOrLogin: '',
    question: '',
    signInCreateOne: '',
  };

  loginOrRegisterFormSubtitle: string = '';

  modalChange() {
    this.loginOrRegisterFormSubtitle =
      this.modalVersion === 'getStarted'
        ? 'Enter your email and password to sing in.'
        : 'Enter your username, email and password to create an account.';

    if (this.modalVersion === 'getStarted') {
      this.loginOrRegister.title = 'Welcome back.';
      this.loginOrRegister.signupOrLogin = 'in';
      this.loginOrRegister.question = 'No account?';
      this.loginOrRegister.signInCreateOne = 'Create one';
    } else {
      this.loginOrRegister.title = 'Join The Creative Spark.';
      this.loginOrRegister.signupOrLogin = 'up';
      this.loginOrRegister.question = 'Already have an account?';
      this.loginOrRegister.signInCreateOne = 'Sign in';
    }

    this.modalVersion =
      this.modalVersion === 'getStarted' ? 'signIn' : 'getStarted';

    this.cdr.detectChanges();
    document
      .querySelector('.modal-content-wrapper')
      ?.querySelector('input')
      ?.focus();
  }

  ngOnInit(): void {
    // Initialize the form group
    this.loginOrRegister =
      this.modalVersion === 'getStarted'
        ? {
            title: 'Join The Creative Spark.',
            signupOrLogin: 'signup',
            question: 'Already have an account?',
            signInCreateOne: 'Sign in',
          }
        : {
            title: 'Welcome back.',
            signupOrLogin: 'login',
            question: 'No account?',
            signInCreateOne: 'Create one',
          };

    this.loginOrRegisterFormSubtitle =
      this.modalVersion === 'getStarted'
        ? 'Enter your username, email and password to create an account.'
        : 'Enter your email and password to sing in.';

    // Set the validators for the forms
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, noWhiteSpaceValidator]],
      email: [
        '',
        [Validators.required, Validators.email, noWhiteSpaceValidator],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), noWhiteSpaceValidator],
      ],
      confirmPassword: [
        '',
        [Validators.required, Validators.minLength(6), noWhiteSpaceValidator],
      ],
    });

    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, noWhiteSpaceValidator],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), noWhiteSpaceValidator],
      ],
    });
  }

  onSubmit(registerOrLoginForm: FormGroup) {
    if (this.modalVersion === 'getStarted') {
      // Register flow
      const payload = {
        username: registerOrLoginForm.value.name,
        email: registerOrLoginForm.value.email,
        password: registerOrLoginForm.value.password,
      };

      this.userService.register$(payload).subscribe({
        next: (user) => {
          // After successful register, log the user in
          this.userService
            .login$({ email: payload.email, password: payload.password })
            .subscribe({
              next: (res: any) => {
                localStorage.setItem('access_token', res.access_token);

                // fetch current user and set in service
                this.userService.me$().subscribe({
                  next: (me) => {
                    this.userService.setCurrentUser(me);
                  },
                  error: () => {},
                  complete: () => this.activeModal.close(),
                });
              },
              error: (err) => {
                console.error('Login after register failed');
              },
            });
        },
        error: (err) => {
          console.error('Register failed');
        },
      });
    } else {
      // Login flow
      const payload = {
        email: registerOrLoginForm.value.email,
        password: registerOrLoginForm.value.password,
      };

      this.userService.login$(payload).subscribe({
        next: (res: any) => {
          localStorage.setItem('access_token', res.access_token);

          this.userService.me$().subscribe({
            next: (me) => {
              this.userService.setCurrentUser(me);
            },
            error: () => {},
            complete: () => this.activeModal.close(),
          });
        },
        error: (err) => {
          console.error('Login failed');
        },
      });
    }
  }
}
