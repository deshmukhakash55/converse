import { Chat } from '../chat-types';

export type LoadChatStartPayload = {
	recipientEmail: string;
	senderEmail: string;
};

export type LoadChatSuccessPayload = {
	chats: Chat[];
	senderEmail: string;
	blockChatId: string;
};

export type LoadChatFailurePayload = {
	reason: string;
};

export type LoadChatEndPayload = {
	senderEmail: string;
};

export type SendMessageStartPayload = {
	from: string;
	to: string;
	message: string;
};

export type SendMessageFailurePayload = {
	reason: string;
};

export type DeleteProfileImageStartPayload = {
	profileImagePath: string;
	loggedInEmail: string;
};

export type DeleteProfileImageFailurePayload = {
	reason: string;
};

export type AddProfileImageStartPayload = {
	file: any;
	loggedInEmail: string;
};

export type AddProfileImageSuccessPayload = {
	url: string;
};

export type AddProfileImageFailurePayload = {
	reason: string;
};
