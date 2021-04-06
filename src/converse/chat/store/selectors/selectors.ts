import { AuthStoreKey } from 'src/converse/authentication/auth-constants';
import { AuthStoreState } from 'src/converse/authentication/auth-types';
import { ContactStoreKey } from 'src/converse/contacts/contact-constants';
import {
	Contact, ContactStoreState
} from 'src/converse/contacts/contact-types';
import { ChatStoreKey } from '../../chat-constants';
import { ChatStoreState } from '../../chat-types';
import { createSelector } from '@ngrx/store';

const chatStateSelector = (state) => state[ChatStoreKey];
const contactStateSelector = (state) => state[ContactStoreKey];
const authStateSelector = (state) => state[AuthStoreKey];

export const chats = createSelector(
	chatStateSelector,
	(state: ChatStoreState) => state.chats
);

export const selectedSender = createSelector(
	chatStateSelector,
	(state: ChatStoreState) => state.selectedSender
);

export const isSendMessageSuccess = createSelector(
	chatStateSelector,
	(state: ChatStoreState) => state.isSendMessageSuccess
);

export const isSendMessageProgress = createSelector(
	chatStateSelector,
	(state: ChatStoreState) => state.isSendMessageProgress
);

export const contactProfileImagePath = createSelector(
	contactStateSelector,
	(state: ContactStoreState, { email }) => {
		const currentContact = state.contacts.find(
			(contact: Contact) => contact.email === email
		);
		return currentContact ? currentContact.profileImagePath : '';
	}
);

export const loggedInUserProfileImagePath = createSelector(
	authStateSelector,
	(state: AuthStoreState) =>
		state.loggedInUser ? state.loggedInUser.profileImagePath || '' : ''
);

export const currentBlockConversationId = createSelector(
	chatStateSelector,
	(state: ChatStoreState) => state.currentBlockConversationId
);

export const isLoadChatProgress = createSelector(
	chatStateSelector,
	(state: ChatStoreState) => state.isLoadChatProgress
);

export const isDeleteProfileImageProgress = createSelector(
	chatStateSelector,
	(state: ChatStoreState) => state.isDeleteProfileImageProgress
);

export const isAddProfileImageProgress = createSelector(
	chatStateSelector,
	(state: ChatStoreState) => state.isAddProfileImageProgress
);
