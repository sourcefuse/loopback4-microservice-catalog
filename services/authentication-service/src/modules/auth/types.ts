export interface OtpResponse {
  key: string;
}

export interface GoogleAuthenticatorResponse {
  key: string;
  qrCode: string;
}

export interface CodeResponse {
  code: string;
}
