"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BearerTokenVerifyProvider = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class BearerTokenVerifyProvider {
    constructor() { }
    value() {
        return async (token) => {
            /*
              Implementing a basic JWT token decryption here
              Leaving the additional security to the consumer of this application
      
              Suggestion: to revoke these tokens put them in redis or some in-memory
              database.
              Use global interceptor over this to apply that check on each api.
            */
            return jsonwebtoken_1.verify(token, 'kdskssdkdfs', {
                issuer: 'sf',
            });
        };
    }
}
exports.BearerTokenVerifyProvider = BearerTokenVerifyProvider;
//# sourceMappingURL=bearer-token-verifier.provider.js.map