import { Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import {
	loadChatProgress, loadChatStart
} from 'src/converse/chat/store/actions/actions';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import { User } from 'src/converse/authentication/auth-types';
import { LoadChatStartPayload } from 'src/converse/chat/store/payload-types';
import {
	blockContactProgress, blockContactStart, unblockContactProgress,
	unblockContactStart
} from '../../store/actions/actions';
import { Contact } from '../../contact-types';
import {
	BlockContactStartPayload, UnblockContactStartPayload
} from '../../store/payload-types';

@Component({
	selector: 'contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
	@Input() public contact: Contact;
	@ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;
	private loggedInEmail: string;
	private loggedInEmailSubscription: Subscription;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeLoggedInEmailSubscription();
	}

	private initializeLoggedInEmailSubscription(): void {
		this.loggedInEmailSubscription = this.store
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
		const blockContactStartPayload = this.getBlockContactStartPayload();
		this.store.dispatch(blockContactStart(blockContactStartPayload));
		this.store.dispatch(blockContactProgress());
		this.matMenuTrigger.closeMenu();
	}

	private getBlockContactStartPayload(): BlockContactStartPayload {
		return {
			loggedInEmail: this.loggedInEmail,
			email: this.contact.email
		};
	}

	public unblockContact(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		const unblockContactStartPayload = this.getUnblockContactStartPayload();
		this.store.dispatch(unblockContactStart(unblockContactStartPayload));
		this.store.dispatch(unblockContactProgress());
		this.matMenuTrigger.closeMenu();
	}

	private getUnblockContactStartPayload(): UnblockContactStartPayload {
		return {
			blockChatId: this.contact.blockChatId,
			loggedInEmail: this.loggedInEmail
		};
	}

	public openContactChat(senderEmail: string): void {
		const loadChatStartPayload = this.getLoadChatStartPayload(senderEmail);
		this.store.dispatch(loadChatStart(loadChatStartPayload));
		this.store.dispatch(loadChatProgress());
	}

	private getLoadChatStartPayload(senderEmail: string): LoadChatStartPayload {
		return {
			senderEmail,
			recipientEmail: this.loggedInEmail
		};
	}

	public ngOnDestroy(): void {
		this.loggedInEmailSubscription.unsubscribe();
	}
}
