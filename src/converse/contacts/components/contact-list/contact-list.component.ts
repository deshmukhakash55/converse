import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import {
	loadChatProgress, loadChatStart
} from 'src/converse/chat/store/actions/actions';
import { selectedSender } from 'src/converse/chat/store/selectors/selectors';
import {
	loadContactsProgress, loadContactsStart
} from '../../store/actions/actions';
import { Contact } from '../../store/payload-types';
import { contacts } from '../../store/selectors/selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
	selector: 'contact-list',
	templateUrl: './contact-list.component.html',
	styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
	public contacts: Contact[];
	public selectedSender: string;
	constructor(private store: Store) {}

	public ngOnInit(): void {
		this.initializeContacts();
		this.initializeSelectedSender();
	}

	private initializeContacts(): void {
		this.store
			.select(loggedInUser)
			.subscribe(({ email }: { email: string }) => {
				if (email) {
					this.store.dispatch(
						loadContactsStart({ loggedInEmail: email })
					);
					this.store.dispatch(loadContactsProgress());
					const contactsSource = this.store
						.select(contacts)
						.pipe(
							map((contactsState: { contacts: Contact[] }) => [
								...contactsState.contacts
							])
						);
					this.setContacts(contactsSource);
				}
			});
	}

	private setContacts(contactSource: Observable<Contact[]>): void {
		contactSource.subscribe((contactList: Contact[]) => {
			this.contacts = contactList;
			if (this.contacts.length > 0) {
				this.store
					.select(loggedInUser)
					.subscribe(({ email }: { email: string }) => {
						const senderEmail = this.contacts.some(
							(contact: Contact) =>
								contact.email === this.selectedSender
						)
							? this.selectedSender
							: this.contacts.length > 0
							? this.contacts[0].email
							: '';
						this.store.dispatch(
							loadChatStart({
								senderEmail,
								recipientEmail: email
							})
						);
						this.store.dispatch(loadChatProgress());
					});
			}
		});
	}

	private initializeSelectedSender(): void {
		this.store
			.select(selectedSender)
			.subscribe(
				(sender: { selectedSender }) =>
					(this.selectedSender = sender.selectedSender)
			);
	}

	public getClass(selectedSenderEmail: string, contactEmail: string): string {
		return selectedSenderEmail === contactEmail ? 'active' : '';
	}
}
