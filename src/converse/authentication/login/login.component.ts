import {
	googleLoginProgress, googleLoginStart, loginProgress, loginStart
} from '../store/actions/actions';
import {
	isLoggingInProcessProgress, isLoggingInProgress, isLoginFailure,
	isLoginSuccess
} from '../store/selectors/selectors';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	@Output() public tabChange: EventEmitter<void> = new EventEmitter();
	public loginForm: FormGroup;
	public isLoginButtonDisabled: boolean;
	public isLoginProgress: boolean;
	public formError: string;

	constructor(private store: Store, private router: Router) {
		this.loginForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required])
		});
	}

	public ngOnInit(): void {
		this.initializeLoggingInProcessProgressSubscription();
		this.initializeLoginFailureSubscription();
		this.initializeLoggingInProgressSubscription();
		this.initializeLoginSuccessSubscription();
	}

	private initializeLoggingInProcessProgressSubscription(): void {
		this.store
			.select(isLoggingInProcessProgress)
			.subscribe(({ isLoginProcessProgress }) => {
				if (isLoginProcessProgress) {
					this.loginForm.controls.email.disable();
					this.loginForm.controls.password.disable();
				} else {
					this.loginForm.controls.email.enable();
					this.loginForm.controls.password.enable();
				}
				this.isLoginButtonDisabled = isLoginProcessProgress;
			});
	}

	private initializeLoggingInProgressSubscription(): void {
		this.store
			.select(isLoggingInProgress)
			.subscribe(({ isLoginProgress }) => {
				this.isLoginProgress = isLoginProgress;
			});
	}

	private initializeLoginFailureSubscription(): void {
		this.store.select(isLoginFailure).subscribe(({ loginError }) => {
			if (loginError === 'email-not-verified') {
				this.formError = '*Please verify your email';
			} else if (
				loginError ===
				'The password is invalid or the user does not have a password.'
			) {
				this.formError = 'Invalid email or password';
			}
		});
	}

	private initializeLoginSuccessSubscription(): void {
		this.store.select(isLoginSuccess).subscribe(({ isLoginSuccess }) => {
			if (isLoginSuccess) {
				this.router.navigate(['chat']);
			}
		});
	}

	public login(event: Event): void {
		event.preventDefault();
		this.store.dispatch(
			loginStart({
				email: this.loginForm.controls.email.value,
				password: this.loginForm.controls.password.value
			})
		);
		this.store.dispatch(loginProgress());
	}

	public loginWithGoogle(event): void {
		event.preventDefault();
		this.store.dispatch(googleLoginStart());
		this.store.dispatch(googleLoginProgress());
	}

	public openRegisterTab(): void {
		this.tabChange.emit();
	}
}
