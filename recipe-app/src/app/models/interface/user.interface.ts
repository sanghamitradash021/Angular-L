export interface User {
  id: number;
  username: string;
  email: string;
  fullname: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DecodedToken {
  id: number;
  exp: number;
  iat: number;
}