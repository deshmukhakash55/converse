import { User } from 'src/converse/authentication/auth-types';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import {
	loadChatProgress, loadChatStart
} from 'src/converse/chat/store/actions/actions';
import {
	blockContactProgress, blockContactStart, unblockContactProgress,
	unblockContactStart
} from '../../store/actions/actions';
import { Contact } from '../../store/payload-types';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngrx/store';

@Component({
	selector: 'contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
	@Input() public contact: Contact;
	private loggedInEmail: string;
	@ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeLoggedInEmailSubscription();
	}

	private initializeLoggedInEmailSubscription(): void {
		this.store
			.select(loggedInUser)
			.subscribe((user: User) => (this.loggedInEmail = user.email));
	}

	public getMessageSenderString(contact: Contact): string {
		if (contact.chatType === 'incoming') {
			return contact.name + ' : ';
		} else if (contact.chatType === 'outgoing') {
			return 'You : ';
		}
		return '';
	}

	public blockContact(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.store.dispatch(blockContactProgress());
		this.store.dispatch(
			blockContactStart({
				loggedInEmail: this.loggedInEmail,
				email: this.contact.email
			})
		);
		this.matMenuTrigger.closeMenu();
	}

	public unblockContact(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.store.dispatch(unblockContactProgress());
		this.store.dispatch(
			unblockContactStart({
				blockChatId: this.contact.blockChatId,
				loggedInEmail: this.loggedInEmail
			})
		);
		this.matMenuTrigger.closeMenu();
	}

	public openContactChat(senderEmail: string): void {
		this.store
			.select(loggedInUser)
			.subscribe(({ email }: { email: string }) => {
				this.store.dispatch(
					loadChatStart({
						senderEmail,
						recipientEmail: email
					})
				);
				this.store.dispatch(loadChatProgress());
			});
	}
}
