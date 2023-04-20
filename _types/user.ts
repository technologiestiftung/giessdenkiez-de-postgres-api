export interface SignupResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	user: User;
}
export interface User {
	id: string;
	aud: string;
	role: string;
	email: string;
	email_confirmed_at: string;
	phone: string;
	last_sign_in_at: string;
	app_metadata: AppMetadata;
	user_metadata: Record<string, unknown>;
	identities?: IdentitiesEntity[] | null;
	created_at: string;
	updated_at: string;
}
export interface AppMetadata {
	provider: string;
	providers?: string[] | null;
}
export interface IdentitiesEntity {
	id: string;
	user_id: string;
	identity_data: IdentityData;
	provider: string;
	last_sign_in_at: string;
	created_at: string;
	updated_at: string;
}
export interface IdentityData {
	email: string;
	sub: string;
}
