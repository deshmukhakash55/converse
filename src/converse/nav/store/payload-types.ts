import { SearchContact } from '../nav-types';

export type SearchContactsStartPayload = {
	searchText: string;
};

export type SearchContactsSuccessPayload = {
	searchContacts: SearchContact[];
};

export type SearchContactsFailurePayload = {
	reason: string;
};
