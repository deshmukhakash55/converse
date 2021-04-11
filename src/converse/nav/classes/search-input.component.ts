import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import {
	loadChatProgress, loadChatStart
} from '../../chat/store/actions/actions';
import {
	loadSingleContactProgress, loadSingleContactStart
} from '../../contacts/store/actions/actions';
import {
	searchContactsProgress, searchContactsStart
} from '../../nav/store/actions/actions';
import { loggedInUser } from '../../authentication/store/selectors/selectors';
import { contacts } from '../../contacts/store/selectors/selectors';
import { searchContacts } from '../../nav/store/selectors/selectors';
import { User } from '../../authentication/auth-types';
import { LoadChatStartPayload } from '../../chat/store/payload-types';
import { Contact } from '../../contacts/contact-types';
import {
	LoadSingleContactStartPayload
} from '../../contacts/store/payload-types';
import { SearchContact } from '../../nav/nav-types';

@Component({
	selector: 'search-input',
	template: ''
})
export abstract class SearchInputComponent implements OnInit, OnDestroy {
	public searchControl: FormControl;
	public filteredContactsSource: Observable<SearchContact[]>;
	private loggedInEmail: string;
	private loadedContacts: Contact[];
	private filteredContactsSubscription: Subscription;
	private loggedInEmailSubscription: Subscription;
	private loadedContactsSubscription: Subscription;

	constructor(private store: Store) {
		this.initializeSearchControl();
	}

	private initializeSearchControl(): void {
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
		const loadSingleContactStartPayload = this.getLoadSingleContactStartPayload(
			searchContact,
			loggedInEmail
		);
		this.store.dispatch(
			loadSingleContactStart(loadSingleContactStartPayload)
		);
	}

	private getLoadSingleContactStartPayload(
		searchContact: SearchContact,
		loggedInEmail: string
	): LoadSingleContactStartPayload {
		return {
			searchContact,
			loggedInEmail
		};
	}

	private dispatchLoadChatStartAction(
		recipientEmail: string,
		senderEmail: string
	): void {
		const loadChatStartPayload = this.getLoadChatStartPayload(
			recipientEmail,
			senderEmail
		);
		this.store.dispatch(loadChatStart(loadChatStartPayload));
	}

	private getLoadChatStartPayload(
		recipientEmail: string,
		senderEmail: string
	): LoadChatStartPayload {
		return {
			recipientEmail,
			senderEmail
		};
	}

	public ngOnDestroy(): void {
		this.filteredContactsSubscription.unsubscribe();
		this.loggedInEmailSubscription.unsubscribe();
		this.loadedContactsSubscription.unsubscribe();
	}
}
