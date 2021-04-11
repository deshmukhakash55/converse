import { Observable, Subscription } from 'rxjs';
import {
	LandingErrorStateMatcher
} from '../../classes/LandingErrorStateMatcher';
import {
	Component, EventEmitter, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
	VerificationMailSentModalComponent
} from '../verification-mail-sent-modal/verification-mail-sent-modal.component';
import {
	googleLoginProgress, googleLoginStart, registerProgress, registerStart
} from '../../store/actions/actions';
import {
	isRegisterFailure, isRegisterProcessProgress, isRegisterProgress,
	isRegisterSuccess
} from '../../store/selectors/selectors';
import { RegisterStartPayload } from '../../store/payload-types';

@Component({
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
	@Output() public tabChange: EventEmitter<void> = new EventEmitter();
	public isSignupButtonDisabled: boolean;
	public isRegisterProgress: boolean;
	public formError: string;
	public signupForm: FormGroup;
	public landingErrorStateMatcher: LandingErrorStateMatcher = new LandingErrorStateMatcher();
	public registerProgressSource: Observable<boolean>;
	private readonly passwordRegex =
		'^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$';
	private verificationMailSentDialogRef: MatDialogRef<VerificationMailSentModalComponent>;
	private confirmedPasswordFormControlSubscription: Subscription;
	private registerProcessProgressSubscription: Subscription;
	private registerFailureSubscription: Subscription;
	private registerSuccessSubscription: Subscription;

	constructor(private store: Store, private matDialog: MatDialog) {
		this.initializeRegisterForm();
	}

	private initializeRegisterForm(): void {
		this.signupForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [
				Validators.required,
				Validators.pattern(new RegExp(this.passwordRegex))
			]),
			confirmedPassword: new FormControl('', [Validators.required])
		});
	}

	public register(event: Event): void {
		event.preventDefault();
		if (this.signupForm.invalid) {
			return;
		}
		const registerStartPayload = this.getRegisterStartPayload();
		this.store.dispatch(registerStart(registerStartPayload));
		this.store.dispatch(registerProgress());
	}

	private getRegisterStartPayload(): RegisterStartPayload {
		const name = this.signupForm.controls.name.value;
		const email = this.signupForm.controls.email.value;
		const password = this.signupForm.controls.password.value;
		return { name, email, password };
	}

	public ngOnInit(): void {
		this.initializeConfirmPasswordMatcherValidator();
		this.initializeRegisterProcessProgressSubscription();
		this.initializeRegisterProgressSource();
		this.initializeRegisterFailureSubscription();
		this.initializeRegisterSuccessSubscription();
	}

	private initializeConfirmPasswordMatcherValidator(): void {
		const confirmedPasswordFormControl = this.signupForm.controls
			.confirmedPassword;
		this.confirmedPasswordFormControlSubscription = confirmedPasswordFormControl.valueChanges.subscribe(
			(value: string) => {
				if (value !== this.signupForm.controls.password.value) {
					this.setConfirmPasswordError();
				}
			}
		);
	}

	private setConfirmPasswordError(): void {
		this.signupForm.controls.confirmedPassword.setErrors(
			{
				mismatch: 'Password and Confirm password do not match'
			},
			{ emitEvent: true }
		);
	}

	private initializeRegisterProcessProgressSubscription(): void {
		this.registerProcessProgressSubscription = this.store
			.select(isRegisterProcessProgress)
			.subscribe((isRegisterProcessProgressStatus: boolean) => {
				if (isRegisterProcessProgressStatus) {
					this.disableRegisterFormControls();
				} else {
					this.enableRegisterFormControls();
				}
				this.isSignupButtonDisabled = isRegisterProcessProgressStatus;
			});
	}

	private disableRegisterFormControls(): void {
		this.signupForm.controls.name.disable();
		this.signupForm.controls.email.disable();
		this.signupForm.controls.password.disable();
		this.signupForm.controls.confirmedPassword.disable();
	}

	private enableRegisterFormControls(): void {
		this.signupForm.controls.name.enable();
		this.signupForm.controls.email.enable();
		this.signupForm.controls.password.enable();
		this.signupForm.controls.confirmedPassword.enable();
	}

	private initializeRegisterProgressSource(): void {
		this.registerProgressSource = this.store.select(isRegisterProgress);
	}

	private initializeRegisterFailureSubscription(): void {
		this.registerFailureSubscription = this.store
			.select(isRegisterFailure)
			.subscribe((registerError: string) =>
				this.handleRegisterError(registerError)
			);
	}

	private handleRegisterError(error: string): void {
		if (
			error === 'The email address is already in use by another account.'
		) {
			this.formError = '*Account already exists. Try logging in.';
		}
	}

	private initializeRegisterSuccessSubscription(): void {
		this.registerSuccessSubscription = this.store
			.select(isRegisterSuccess)
			.subscribe((isRegisterSuccessStatus: boolean) => {
				if (
					!isRegisterSuccessStatus ||
					!!this.verificationMailSentDialogRef
				) {
					return;
				}
				this.signupForm.reset();
				this.openLoginTabAndShowVerficationMailSentModal();
			});
	}

	private openLoginTabAndShowVerficationMailSentModal(): void {
		this.openLoginTab();
		this.verificationMailSentDialogRef = this.matDialog.open<VerificationMailSentModalComponent>(
			VerificationMailSentModalComponent,
			{
				height: '11em',
				width: '30em'
			}
		);
	}

	public openLoginTab(): void {
		this.tabChange.emit();
	}

	public loginWithGoogle(event: Event): void {
		event.preventDefault();
		this.store.dispatch(googleLoginStart());
		this.store.dispatch(googleLoginProgress());
	}

	public ngOnDestroy(): void {
		this.confirmedPasswordFormControlSubscription.unsubscribe();
		this.registerProcessProgressSubscription.unsubscribe();
		this.registerFailureSubscription.unsubscribe();
		this.registerSuccessSubscription.unsubscribe();
	}
}
