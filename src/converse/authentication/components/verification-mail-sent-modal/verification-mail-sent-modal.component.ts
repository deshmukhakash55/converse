import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'verification-mail-sent-modal',
	templateUrl: './verification-mail-sent-modal.component.html',
	styleUrls: ['./verification-mail-sent-modal.component.scss']
})
export class VerificationMailSentModalComponent {
	constructor(
		private matDialogRef: MatDialogRef<VerificationMailSentModalComponent>
	) {}

	public close(): void {
		this.matDialogRef.close();
	}
}
