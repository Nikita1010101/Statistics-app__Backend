export class ApiError extends Error {
	public status: number
	public message: string = ''
	public errors: unknown[] = []

	constructor(status: number, message: string, errors: unknown[] = []) {
		super(message)
		this.status = status
		this.errors = errors
	}

	static Forbidden(message: string, errors: unknown[] = []) {
		return new ApiError(403, message, errors)
	}

	static UnautorizedError() {
		return new ApiError(401, 'User not autorized!')
	}

	static BadRequest(message: string, errors: unknown[] = []) {
		return new ApiError(400, message, errors)
	}
}
