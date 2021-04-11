import { createSelector } from '@ngrx/store';
import { selectedSender } from 'src/converse/chat/store/selectors/selectors';
import { Contact, ContactStoreState } from '../../contact-types';
import { ContactStoreKey } from '../../contact-constants';

const contactStateSelector = (state) => state[ContactStoreKey];

export const isLoadContactsProgress = createSelector(
	contactStateSelector,
	(state: ContactStoreState) => state.isLoadContactsProgress
);

export const isLoadSingleContactProgress = createSelector(
	contactStateSelector,
	(state: ContactStoreState) => state.isLoadSingleContactProgress
);

export const contacts = createSelector(
	contactStateSelector,
	(state: ContactStoreState) => state.contacts
);

export const selectedSenderName = createSelector(
	contactStateSelector,
	selectedSender,
	(contactState: ContactStoreState, selectedSenderData: string) => {
		if (!selectedSender) {
			if (contactState.contacts.length > 0) {
				return contactState.contacts[0].name;
			} else {
				return '';
			}
		}
		const senderInContacts = contactState.contacts.find(
			(contact: Contact) => contact.email === selectedSenderData
		);
		return senderInContacts && senderInContacts.name
			? senderInContacts.name
			: '';
	}
);
