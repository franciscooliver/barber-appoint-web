export interface Credentials {
  email: string
  password: string
}

interface Address {
  id: number
  street: string
  city: string
  state: string
  zipcode: string
}

export interface User {
  id: number
  name: string
  email: string
  isActive: boolean
  role: string
  access_token: string,
  address?: Address
}

export interface ApiResponse {
  message: string
  access_token?: string
  data?: object
  user?: User
}

export interface ApiResponseError {
  message: string
  statusCode: number
}

export class SuccessResponse implements ApiResponse {
  constructor(
    public message: string,
    public data?: object,
    public token?: string,
    public user?: User,
  ) {}
  access_token?: string | undefined

  static create(data: ApiResponse): SuccessResponse {
    console.log(data)

    return new SuccessResponse(data.message, data.data, data.access_token, data.user)
  }
}

export class ErrorResponse implements ApiResponseError {
  constructor(
    public message: string,
    public statusCode: number,
  ) {}

  static create(error: ApiResponseError): ErrorResponse {
    return new ErrorResponse(error.message, error.statusCode)
  }
}
