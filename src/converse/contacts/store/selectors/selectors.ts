import { selectedSender } from 'src/converse/chat/store/selectors/selectors';
import { ContactStoreKey } from '../../contact-constants';
import { ContactStoreState } from '../../contact-types';
import { Contact } from '../payload-types';
import { createSelector } from '@ngrx/store';

const contactStateSelector = (state) => state[ContactStoreKey];

export const isLoadContactsProgress = createSelector(
	contactStateSelector,
	(state: ContactStoreState) => ({
		isLoadContactsProgress: state.isLoadContactsProgress
	})
);

export const contacts = createSelector(
	contactStateSelector,
	(state: ContactStoreState) => ({
		contacts: state.contacts
	})
);

export const selectedSenderName = createSelector(
	contactStateSelector,
	selectedSender,
	(contactState: ContactStoreState, { selectedSender }) => {
		if (!selectedSender) {
			if (contactState.contacts.length > 0) {
				return contactState.contacts[0].name;
			} else {
				return '';
			}
		}
		return contactState.contacts.find(
			(contact: Contact) => contact.email === selectedSender
		).name;
	}
);
