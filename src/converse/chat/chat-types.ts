export type Chat = {
	message: string;
	date: Date;
	to: string;
	from: string;
};

export type ChatStoreState = {
	chats: Chat[];
	selectedSender: string;
	isLoadChatProgress: boolean;
	isSendMessageProgress: boolean;
	isSendMessageSuccess: boolean;
	sendMessageFailureReason: string;
	loadChatFailureReason: string;
	currentBlockConversationId: string;
	isDeleteProfileImageProgress: boolean;
	isDeleteProfileImageSuccess: boolean;
	deleteProfileImageFailureReason: string;
	isAddProfileImageProgress: boolean;
	isAddProfileImageSuccess: boolean;
	addProfileImageFailureReason: string;
};

export type ChatType = 'incoming' | 'outgoing';
