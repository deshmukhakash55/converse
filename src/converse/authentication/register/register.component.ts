import { LandingErrorStateMatcher } from '../classes/LandingErrorStateMatcher';
import {
	googleLoginProgress, googleLoginStart, registerProgress, registerStart
} from '../store/actions/actions';
import {
	isRegisterFailure, isRegisterProcessProgress, isRegisterProgress,
	isRegisterSuccess
} from '../store/selectors/selectors';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
	VerificationMailSentModalComponent
} from '../verification-mail-sent-modal/verification-mail-sent-modal.component';

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	@Output() public tabChange: EventEmitter<void> = new EventEmitter();
	public isSignupButtonDisabled: boolean;
	public isRegisterProgress: boolean;
	public formError: string;
	public signupForm: FormGroup;
	private verificationMailSentDialogRef: MatDialogRef<VerificationMailSentModalComponent>;
	public landingErrorStateMatcher: LandingErrorStateMatcher = new LandingErrorStateMatcher();

	constructor(private store: Store, private matDialog: MatDialog) {
		this.signupForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.pattern(
					new RegExp(
						'^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$'
					)
				)
			]),
			confirmedPassword: new FormControl('', [Validators.required])
		});
	}

	public register(event: Event): void {
		event.preventDefault();
		if (this.signupForm.invalid) {
			return;
		}
		const name = this.signupForm.controls.name.value;
		const email = this.signupForm.controls.email.value;
		const password = this.signupForm.controls.password.value;
		this.store.dispatch(registerStart({ name, email, password }));
		this.store.dispatch(registerProgress());
	}

	public ngOnInit(): void {
		this.initializeConfirmPasswordMatcherValidator();
		this.initializeRegisterProcessProgressSubscription();
		this.initializeRegisterProgressSubscription();
		this.initializeRegisterFailureSubscription();
		this.initializeRegisterSuccessSubscription();
	}

	private initializeConfirmPasswordMatcherValidator(): void {
		const confirmedPasswordFormControl = this.signupForm.controls
			.confirmedPassword;
		confirmedPasswordFormControl.valueChanges.subscribe((value: string) => {
			if (value !== this.signupForm.controls.password.value) {
				confirmedPasswordFormControl.setErrors(
					{
						mismatch: 'Password and Confirm password do not match'
					},
					{ emitEvent: true }
				);
			}
		});
	}

	private initializeRegisterProcessProgressSubscription(): void {
		this.store
			.select(isRegisterProcessProgress)
			.subscribe((state: { isRegisterProcessProgress: boolean }) => {
				if (state.isRegisterProcessProgress) {
					this.signupForm.controls.name.disable();
					this.signupForm.controls.email.disable();
					this.signupForm.controls.password.disable();
					this.signupForm.controls.confirmedPassword.disable();
				} else {
					this.signupForm.controls.name.enable();
					this.signupForm.controls.email.enable();
					this.signupForm.controls.password.enable();
					this.signupForm.controls.confirmedPassword.enable();
				}
				this.isSignupButtonDisabled = state.isRegisterProcessProgress;
			});
	}

	private initializeRegisterProgressSubscription(): void {
		this.store
			.select(isRegisterProgress)
			.subscribe((state: { isRegisterProgress: boolean }) => {
				this.isRegisterProgress = state.isRegisterProgress;
			});
	}

	private initializeRegisterFailureSubscription(): void {
		this.store.select(isRegisterFailure).subscribe(({ registerError }) => {
			if (
				registerError ===
				'The email address is already in use by another account.'
			) {
				this.formError = '*Account already exists. Try logging in.';
			}
		});
	}

	private initializeRegisterSuccessSubscription(): void {
		this.store
			.select(isRegisterSuccess)
			.subscribe(({ isRegisterSuccess }) => {
				if (
					!isRegisterSuccess ||
					!!this.verificationMailSentDialogRef
				) {
					return;
				}
				this.signupForm.reset();
				this.openLoginTab();
				this.verificationMailSentDialogRef = this.matDialog.open<VerificationMailSentModalComponent>(
					VerificationMailSentModalComponent,
					{
						height: '11em',
						width: '30em'
					}
				);
			});
	}

	public openLoginTab(): void {
		this.tabChange.emit();
	}

	public loginWithGoogle(event: Event): void {
		event.preventDefault();
		this.store.dispatch(googleLoginStart());
		this.store.dispatch(googleLoginProgress());
	}
}
