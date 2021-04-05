import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import {
	loadChatProgress, loadChatStart
} from 'src/converse/chat/store/actions/actions';
import { selectedSender } from 'src/converse/chat/store/selectors/selectors';
import { Contact } from '../../contact-types';
import {
	loadContactsProgress, loadContactsStart
} from '../../store/actions/actions';
import { contacts } from '../../store/selectors/selectors';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'contact-list',
	templateUrl: './contact-list.component.html',
	styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, OnDestroy {
	public contacts: Contact[];
	public selectedSender: string;
	private contactsSubscription: Subscription;
	private selectedSenderSubscription: Subscription;
	private contactSourceSubscription: Subscription;

	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeContactsSubscription();
		this.initializeSelectedSenderSubscription();
	}

	private initializeContactsSubscription(): void {
		this.contactsSubscription = this.store
			.select(loggedInUser)
			.subscribe(({ email }: { email: string }) => {
				if (email) {
					this.loadContactsFor(email);
				}
			});
	}

	private loadContactsFor(email: string): void {
		this.store.dispatch(loadContactsStart({ loggedInEmail: email }));
		this.store.dispatch(loadContactsProgress());
		const contactsSource = this.store
			.select(contacts)
			.pipe(map((contactList: Contact[]) => [...contactList]));
		this.setContacts(contactsSource);
	}

	private setContacts(contactSource: Observable<Contact[]>): void {
		this.contactSourceSubscription = contactSource.subscribe(
			(contactList: Contact[]) => {
				this.contacts = contactList;
				if (this.contacts.length > 0) {
					this.loadChatForLoggedInUser();
				}
			}
		);
	}

	private loadChatForLoggedInUser(): void {
		this.store
			.select(loggedInUser)
			.subscribe(({ email }: { email: string }) => {
				const senderEmail = this.contacts.some(
					(contact: Contact) => contact.email === this.selectedSender
				)
					? this.selectedSender
					: this.contacts.length > 0
					? this.contacts[0].email
					: '';
				this.store.dispatch(loadChatProgress());
				this.store.dispatch(
					loadChatStart({
						senderEmail,
						recipientEmail: email
					})
				);
			});
	}

	private initializeSelectedSenderSubscription(): void {
		this.selectedSenderSubscription = this.store
			.select(selectedSender)
			.subscribe((sender: string) => (this.selectedSender = sender));
	}

	public getClass(selectedSenderEmail: string, contactEmail: string): string {
		return selectedSenderEmail === contactEmail ? 'active' : '';
	}

	public ngOnDestroy(): void {
		this.contactSourceSubscription.unsubscribe();
		this.selectedSenderSubscription.unsubscribe();
		this.contactsSubscription.unsubscribe();
	}
}
