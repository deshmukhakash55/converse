import { SearchContact } from 'src/converse/nav/nav-types';
import { Contact } from '../contact-types';

export type LoadedContactsStartPayload = {
	loggedInEmail: string;
};

export type LoadedContactsSuccessPayload = {
	contacts: Contact[];
};

export type LoadedContactsFailurePayload = {
	reason: string;
};

export type LoadSingleContactStartPayload = {
	searchContact: SearchContact;
	loggedInEmail: string;
};

export type LoadSingleContactSuccessPayload = {
	contact: Contact;
};

export type LoadSingleContactFailurePayload = {
	reason: string;
};

export type BlockContactStartPayload = {
	loggedInEmail: string;
	email: string;
};

export type BlockContactFailurePayload = {
	reason: string;
};

export type UnblockContactStartPayload = {
	blockChatId: string;
	loggedInEmail: string;
};

export type UnblockContactFailurePayload = {
	reason: string;
};
