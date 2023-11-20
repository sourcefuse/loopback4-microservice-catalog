export interface ApiKeyVerificationServiceInterface {
  verifyApiKeys(apiKey: string, apiSecret: string): Promise<boolean>;
}
