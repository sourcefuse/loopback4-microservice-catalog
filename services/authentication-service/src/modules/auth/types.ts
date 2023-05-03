// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export interface OtpResponse {
  key?: string;
}

export interface CodeResponse {
  code: string;
}

export interface QrCodeCreateResponse {
  qrCode: string;
}

export interface QrCodeCheckResponse {
  isGenerated: boolean;
}
