import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/converse/authentication/auth-types';
import {
	loggedInUser
} from 'src/converse/authentication/store/selectors/selectors';
import {
	loadChatProgress, loadChatStart
} from 'src/converse/chat/store/actions/actions';
import { Contact } from 'src/converse/contacts/contact-types';
import {
	loadSingleContactProgress, loadSingleContactStart
} from 'src/converse/contacts/store/actions/actions';
import { contacts } from 'src/converse/contacts/store/selectors/selectors';
import { SearchContact } from '../../nav-types';
import {
	searchContactsProgress, searchContactsStart
} from '../../store/actions/actions';
import { searchContacts } from '../../store/selectors/selectors';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';

@Component({
	selector: 'nav-search-input',
	templateUrl: './nav-search-input.component.html',
	styleUrls: ['./nav-search-input.component.scss']
})
export class NavSearchInputComponent implements OnInit, OnDestroy {
	public searchControl: FormControl;
	public filteredContactsSource: Observable<SearchContact[]>;
	private loggedInEmail: string;
	private loadedContacts: Contact[];
	private filteredContactsSubscription: Subscription;
	private loggedInEmailSubscription: Subscription;
	private loadedContactsSubscription: Subscription;

	constructor(private store: Store) {
		this.searchControl = new FormControl('');
	}

	public ngOnInit(): void {
		this.initializeFilteredContactsSubscriptionAndSource();
		this.initializeLoggedInEmailSubscription();
		this.initializeLoadedContactsSubscription();
	}

	private initializeFilteredContactsSubscriptionAndSource(): void {
		this.filteredContactsSubscription = this.searchControl.valueChanges.subscribe(
			(searched: string | SearchContact) => {
				if (typeof searched === 'string') {
					this.dispatchSearchContactsProgressAndStartActions(
						searched
					);
				} else {
					this.dispatchSearchContactsProgressAndStartActions(
						searched ? searched.name : ''
					);
				}
			}
		);
		this.initializeFilteredContactsSource();
	}

	private initializeFilteredContactsSource(): void {
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

	private dispatchSearchContactsProgressAndStartActions(
		searchText: string
	): void {
		this.store.dispatch(searchContactsProgress());
		this.store.dispatch(
			searchContactsStart({ searchText: searchText || '' })
		);
	}

	private initializeLoggedInEmailSubscription(): void {
		this.loggedInEmailSubscription = this.store
			.select(loggedInUser)
			.subscribe((user: User) => (this.loggedInEmail = user.email));
	}

	private initializeLoadedContactsSubscription(): void {
		this.loadedContactsSubscription = this.store
			.select(contacts)
			.subscribe((loadedContacts: Contact[]) => {
				this.loadedContacts = loadedContacts;
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

	public openContactChat(event: MatAutocompleteSelectedEvent): void {
		const selectedOptionValue = event.option.value;
		const contact = this.getSelectedOptionValueFromLoadedContacts(
			selectedOptionValue
		);
		if (!contact) {
			this.store.dispatch(loadSingleContactProgress());
			this.dispatchLoadSingleContactStartAction(
				selectedOptionValue,
				this.loggedInEmail
			);
		} else {
			this.store.dispatch(loadChatProgress());
			this.dispatchLoadChatStartAction(this.loggedInEmail, contact.email);
		}
	}

	private getSelectedOptionValueFromLoadedContacts(
		selectedOptionValue: SearchContact
	): Contact | null {
		return this.loadedContacts.find(
			(loadedContact: Contact) =>
				loadedContact.name === selectedOptionValue.name
		);
	}

	private dispatchLoadSingleContactStartAction(
		searchContact: SearchContact,
		loggedInEmail: string
	): void {
		this.store.dispatch(
			loadSingleContactStart({
				searchContact,
				loggedInEmail
			})
		);
	}

	private dispatchLoadChatStartAction(
		recipientEmail: string,
		senderEmail: string
	): void {
		this.store.dispatch(
			loadChatStart({
				recipientEmail,
				senderEmail
			})
		);
	}

	public ngOnDestroy(): void {
		this.filteredContactsSubscription.unsubscribe();
		this.loggedInEmailSubscription.unsubscribe();
		this.loadedContactsSubscription.unsubscribe();
	}
}
