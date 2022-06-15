export interface OtpResponse {
  key?: string;
}

export interface CodeResponse {
  code: string;
}

export interface QrCodeResponse {
  userId?: string;
  qrCode?: string;
}
