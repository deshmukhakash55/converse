import { createReducer, on } from '@ngrx/store';
import {
	addProfileImageEnd, addProfileImageFailure, addProfileImageProgress,
	addProfileImageSuccess, deleteProfileImageEnd, deleteProfileImageFailure,
	deleteProfileImageProgress, deleteProfileImageSuccess, loadChatEnd,
	loadChatFailure, loadChatProgress, loadChatSuccess, reinitChatState,
	sendMessageEnd, sendMessageFailure, sendMessageProgress, sendMessageSuccess
} from '../actions/actions';
import { ChatStoreState } from '../../chat-types';
import {
	AddProfileImageFailurePayload, DeleteProfileImageFailurePayload,
	LoadChatFailurePayload, LoadChatSuccessPayload, SendMessageFailurePayload
} from '../payload-types';

const initialState: ChatStoreState = {
	chats: [],
	isLoadChatProgress: false,
	selectedSender: '',
	isSendMessageProgress: false,
	sendMessageFailureReason: '',
	isSendMessageSuccess: false,
	loadChatFailureReason: '',
	currentBlockConversationId: null,
	isDeleteProfileImageProgress: false,
	isDeleteProfileImageSuccess: false,
	deleteProfileImageFailureReason: '',
	isAddProfileImageProgress: false,
	isAddProfileImageSuccess: false,
	addProfileImageFailureReason: ''
};

export const reducer = createReducer(
	initialState,
	on(loadChatProgress, (state: ChatStoreState) => ({
		...state,
		isLoadChatProgress: true
	})),
	on(loadChatEnd, (state: ChatStoreState) => ({
		...state,
		isLoadChatProgress: false
	})),
	on(
		loadChatSuccess,
		(
			state: ChatStoreState,
			loadChatSuccessPayload: LoadChatSuccessPayload
		) => ({
			...state,
			chats: [...loadChatSuccessPayload.chats],
			selectedSender: loadChatSuccessPayload.senderEmail,
			currentBlockConversationId: loadChatSuccessPayload.blockChatId
		})
	),
	on(
		loadChatFailure,
		(
			state: ChatStoreState,
			loadChatFailurePayload: LoadChatFailurePayload
		) => ({
			...state,
			loadChatFailureReason: loadChatFailurePayload.reason
		})
	),
	on(sendMessageProgress, (state: ChatStoreState) => ({
		...state,
		isSendMessageProgress: true,
		isSendMessageSuccess: false
	})),
	on(sendMessageEnd, (state: ChatStoreState) => ({
		...state,
		isSendMessageProgress: false
	})),
	on(sendMessageSuccess, (state: ChatStoreState) => ({
		...state,
		sendMessageFailureReason: '',
		isSendMessageSuccess: true
	})),
	on(
		sendMessageFailure,
		(
			state: ChatStoreState,
			sendMessageStartPayload: SendMessageFailurePayload
		) => ({
			...state,
			sendMessageFailureReason: sendMessageStartPayload.reason,
			isSendMessageSuccess: false
		})
	),
	on(deleteProfileImageProgress, (state: ChatStoreState) => ({
		...state,
		isDeleteProfileImageProgress: true,
		isDeleteProfileImageSuccess: false,
		deleteProfileImageFailureReason: ''
	})),
	on(deleteProfileImageEnd, (state: ChatStoreState) => ({
		...state,
		isDeleteProfileImageProgress: false
	})),
	on(deleteProfileImageSuccess, (state: ChatStoreState) => ({
		...state,
		isDeleteProfileImageSuccess: true,
		deleteProfileImageFailureReason: ''
	})),
	on(
		deleteProfileImageFailure,
		(
			state: ChatStoreState,
			deleteProfileImageFailurePayload: DeleteProfileImageFailurePayload
		) => ({
			...state,
			isDeleteProfileImageSuccess: false,
			deleteProfileImageFailureReason:
				deleteProfileImageFailurePayload.reason
		})
	),
	on(addProfileImageProgress, (state: ChatStoreState) => ({
		...state,
		isAddProfileImageProgress: true,
		isAddProfileImageSuccess: false,
		addProfileImageFailureReason: ''
	})),
	on(addProfileImageEnd, (state: ChatStoreState) => ({
		...state,
		isAddProfileImageProgress: false
	})),
	on(addProfileImageSuccess, (state: ChatStoreState) => ({
		...state,
		isAddProfileImageSuccess: true,
		addProfileImageFailureReason: ''
	})),
	on(
		addProfileImageFailure,
		(
			state: ChatStoreState,
			addProfileImageFailurePayload: AddProfileImageFailurePayload
		) => ({
			...state,
			isAddProfileImageSuccess: false,
			addProfileImageFailureReason: addProfileImageFailurePayload.reason
		})
	),
	on(reinitChatState, (state: ChatStoreState) => ({
		...initialState
	}))
);
