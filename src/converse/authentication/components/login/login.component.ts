import { Observable, Subscription } from 'rxjs';
import {
	Component, EventEmitter, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	googleLoginProgress, googleLoginStart, loginProgress, loginStart
} from '../../store/actions/actions';
import {
	isLoggingInProcessProgress, isLoggingInProgress, isLoginFailure,
	isLoginSuccess
} from '../../store/selectors/selectors';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
	@Output() public tabChange: EventEmitter<void> = new EventEmitter();
	public loginForm: FormGroup;
	public isLoginButtonDisabled: boolean;
	public loggingInProgressSource: Observable<boolean>;
	public formError: string;
	private loginSuccessSubscription: Subscription;
	private loginFailureSubscription: Subscription;
	private loggingInProcessProgressSubscription: Subscription;

	constructor(private store: Store, private router: Router) {
		this.initializeLoginForm();
	}

	private initializeLoginForm(): void {
		this.loginForm = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required])
		});
	}

	public ngOnInit(): void {
		this.initializeLoggingInProcessProgressSubscription();
		this.initializeLoginFailureSubscription();
		this.initializeLoggingInProgressSource();
		this.initializeLoginSuccessSubscription();
	}

	private initializeLoggingInProcessProgressSubscription(): void {
		this.loggingInProcessProgressSubscription = this.store
			.select(isLoggingInProcessProgress)
			.subscribe((isLoginProcessProgress: boolean) => {
				if (isLoginProcessProgress) {
					this.disableLoginFormControls();
				} else {
					this.enableLoginFormControls();
				}
				this.isLoginButtonDisabled = isLoginProcessProgress;
			});
	}

	private disableLoginFormControls(): void {
		this.loginForm.controls.email.disable();
		this.loginForm.controls.password.disable();
	}

	private enableLoginFormControls(): void {
		this.loginForm.controls.email.enable();
		this.loginForm.controls.password.enable();
	}

	private initializeLoginFailureSubscription(): void {
		this.loginFailureSubscription = this.store
			.select(isLoginFailure)
			.subscribe((loginError: string) =>
				this.handleLoginError(loginError)
			);
	}

	private handleLoginError(error: string): void {
		if (error === 'email-not-verified') {
			this.formError = '*Please verify your email';
		} else if (
			error ===
			'The password is invalid or the user does not have a password.'
		) {
			this.formError = 'Invalid email or password';
		} else if (
			error ===
			'There is no user record corresponding to this identifier. The user may have been deleted.'
		) {
			this.formError =
				'Account with this email do not exists. Try registering.';
		} else if (error === 'User not logged in') {
			this.formError = '';
		} else {
			this.formError = 'Unknown error';
		}
	}

	private initializeLoggingInProgressSource(): void {
		this.loggingInProgressSource = this.store.select(isLoggingInProgress);
	}

	private initializeLoginSuccessSubscription(): void {
		this.loginSuccessSubscription = this.store
			.select(isLoginSuccess)
			.subscribe((isLoginSuccessStatus: boolean) => {
				if (isLoginSuccessStatus) {
					this.router.navigate(['chat']);
				}
			});
	}

	public login(event: Event): void {
		event.preventDefault();
		const loginStartPayload = {
			email: this.loginForm.controls.email.value,
			password: this.loginForm.controls.password.value
		};
		this.store.dispatch(loginStart(loginStartPayload));
		this.store.dispatch(loginProgress());
	}

	public loginWithGoogle(event: Event): void {
		event.preventDefault();
		this.store.dispatch(googleLoginStart());
		this.store.dispatch(googleLoginProgress());
	}

	public openRegisterTab(): void {
		this.tabChange.emit();
	}

	public ngOnDestroy(): void {
		this.loggingInProcessProgressSubscription.unsubscribe();
		this.loginFailureSubscription.unsubscribe();
		this.loginSuccessSubscription.unsubscribe();
	}
}
