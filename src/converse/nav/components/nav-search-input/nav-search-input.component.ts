import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/converse/authentication/auth-types';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import { loadChatStart } from 'src/converse/chat/store/actions/actions';
import {
	loadSingleContactProgress, loadSingleContactStart
} from 'src/converse/contacts/store/actions/actions';
import { Contact } from 'src/converse/contacts/store/payload-types';
import { contacts } from 'src/converse/contacts/store/selectors/selectors';
import { SearchContact } from '../../nav-types';
import { searchContactsStart } from '../../store/actions/actions';
import { searchContacts } from '../../store/selectors/selectors';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';

@Component({
	selector: 'nav-search-input',
	templateUrl: './nav-search-input.component.html',
	styleUrls: ['./nav-search-input.component.scss']
})
export class NavSearchInputComponent implements OnInit {
	public searchControl: FormControl;
	public filteredContactsSource: Observable<SearchContact[]>;
	private loggedInEmail: string;
	private loadedContacts: Contact[];
	constructor(private store: Store) {
		this.searchControl = new FormControl('');
	}

	public ngOnInit(): void {
		this.initializeFilteredContactsSubscription();
		this.initializeLoggedInEmailSubscription();
		this.initializeLoadedContactsSubscription();
	}

	private initializeLoggedInEmailSubscription(): void {
		this.store
			.select(loggedInUser)
			.subscribe((user: User) => (this.loggedInEmail = user.email));
	}

	private initializeLoadedContactsSubscription(): void {
		this.store
			.select(contacts)
			.subscribe((loadedContacts: { contacts: Contact[] }) => {
				this.loadedContacts = loadedContacts.contacts;
			});
	}

	public displayFn(contact: SearchContact): string {
		if (contact && contact.name) {
			return `${contact.name} (${contact.email})`;
		}
		return '';
	}

	public getSearchContactText(contact: SearchContact): string {
		if (contact && contact.name) {
			return `${contact.name} (${contact.email})`;
		}
		return '';
	}

	private initializeFilteredContactsSubscription(): void {
		this.searchControl.valueChanges.subscribe(
			(searched: string | SearchContact) => {
				if (typeof searched === 'string') {
					this.store.dispatch(
						searchContactsStart({ searchText: searched || '' })
					);
				} else {
					this.store.dispatch(
						searchContactsStart({
							searchText: searched ? searched.name : ''
						})
					);
				}
			}
		);
		this.filteredContactsSource = this.store
			.select(searchContacts)
			.pipe(
				map((contactList: SearchContact[]) =>
					contactList.filter(
						(contact: SearchContact) =>
							contact.email !== this.loggedInEmail
					)
				)
			);
	}

	public openContactChat(event: MatAutocompleteSelectedEvent): void {
		const selectedOptionValue = event.option.value;
		this.store.dispatch(loadSingleContactProgress());
		const contact = this.loadedContacts.find(
			(loadedContact: Contact) =>
				loadedContact.name === selectedOptionValue.name
		);
		if (!contact) {
			this.store.dispatch(
				loadSingleContactStart({
					searchContact: selectedOptionValue,
					loggedInEmail: this.loggedInEmail
				})
			);
		} else {
			this.store.dispatch(
				loadChatStart({
					recipientEmail: this.loggedInEmail,
					senderEmail: contact.email
				})
			);
		}
	}
}
