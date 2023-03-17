// FIXME: Mocking is a code smell. Get a token from the local dev server and use that instead.
import { verifySupabaseToken } from "../_utils/verify-supabase-token";
import { VercelRequest } from "@vercel/node";
import { supabase } from "../_utils/supabase";
import { GDKAuthError } from "../_utils/errors";
import { AuthError, User } from "@supabase/supabase-js";
jest.mock("../_utils/supabase", () => ({
	supabase: {
		auth: {
			getUser: jest.fn(),
		},
	},
}));

describe("verifySupabaseToken", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should return an error when authorization header is missing", async () => {
		const request = {
			headers: {},
		} as VercelRequest;

		const { data, error } = await verifySupabaseToken(request);

		expect(data).toBeNull();
		expect(error).toBeInstanceOf(GDKAuthError);
		expect(error?.message).toBe("not authorized");
	});

	test("should return an error when access_token is missing", async () => {
		const request = {
			headers: {
				authorization: "Bearer ",
			},
		} as VercelRequest;

		const { data, error } = await verifySupabaseToken(request);

		expect(data).toBeNull();
		expect(error).toBeInstanceOf(GDKAuthError);
		expect(error?.message).toBe("not authorized");
	});
	test("should return an error if the access token is invalid", async () => {
		const request = {
			headers: { authorization: "Bearer invalid" },
		} as VercelRequest;
		const getUserMock = supabase.auth.getUser as jest.MockedFunction<
			typeof supabase.auth.getUser
		>;
		getUserMock.mockResolvedValueOnce({
			error: new AuthError("Invalid token"),
			data: { user: null },
		});
		const result = await verifySupabaseToken(request);
		expect(getUserMock).toHaveBeenCalledWith("invalid");
		expect(result).toEqual({
			data: null,
			error: new AuthError("Invalid token"),
		});
	});

	test("should return the user data if the access token is valid", async () => {
		const request = {
			headers: { authorization: "Bearer valid" },
		} as VercelRequest;
		const getUserMock = supabase.auth.getUser as jest.MockedFunction<
			typeof supabase.auth.getUser
		>;
		const userData = {
			user: { id: "123", email: "test@example.com" },
		} as {
			user: User;
		};
		getUserMock.mockResolvedValueOnce({ data: userData, error: null });
		const result = await verifySupabaseToken(request);
		expect(getUserMock).toHaveBeenCalledWith("valid");
		expect(result).toEqual({
			data: userData.user,
			error: null,
		});
	});
});
