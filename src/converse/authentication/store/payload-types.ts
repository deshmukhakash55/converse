export type LoginPayload = {
	email: string;
	password: string;
};

export type LoginSuccessPayload = {
	user: {
		id: string;
		email: string;
	};
};

export type LoginFailurePayload = {
	reason: string;
};

export type RegisterPayload = {
	name: string;
	email: string;
	password: string;
};

export type RegisterFailurePayload = {
	reason: string;
};

export type ContactPayload = {
	contact: {
		name: string;
		email: string;
		profileImagePath: string;
	};
};
