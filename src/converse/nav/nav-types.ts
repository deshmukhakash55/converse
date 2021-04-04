import { Contact } from '../contacts/store/payload-types';

export type NavStoreState = {
	searchContacts: Contact[];
	isSearchContactsProgress: boolean;
	searchContactsFailureReason: string;
};

export type SearchContact = {
	name: string;
	email: string;
	profileImagePath: string;
};
