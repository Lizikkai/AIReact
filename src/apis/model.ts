export type LoginParams = {
  name: string;
  password: string;
}

export type RegisterParams = LoginParams & { mobile: string }