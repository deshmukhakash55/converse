import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class LandingErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null): boolean {
		return !!(
			control &&
			control.invalid &&
			(control.dirty || control.touched)
		);
	}
}
