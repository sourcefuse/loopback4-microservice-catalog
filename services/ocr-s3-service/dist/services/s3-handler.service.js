"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3HandlerService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const loopback4_s3_1 = require("loopback4-s3");
let S3HandlerService = class S3HandlerService {
    constructor(s3Client) {
        this.s3Client = s3Client;
    }
    async listObjects(bucketName, contractName) {
        const { Contents } = await this.s3Client.listObjectsV2({
            Bucket: bucketName,
            Prefix: contractName,
        });
        return Contents;
    }
    async getObject(bucketName, key) {
        const data = await this.s3Client.getObject({
            Bucket: bucketName,
            Key: key,
        });
        const { Body } = data;
        return Body;
    }
    // eslint-disable-next-line
    async streamToString(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            // eslint-disable-next-line
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
    }
};
S3HandlerService = tslib_1.__decorate([
    (0, core_1.injectable)({
        scope: core_1.BindingScope.TRANSIENT,
    }),
    tslib_1.__param(0, (0, core_1.inject)(loopback4_s3_1.AWSS3Bindings.AwsS3Provider)),
    tslib_1.__metadata("design:paramtypes", [loopback4_s3_1.S3WithSigner])
], S3HandlerService);
exports.S3HandlerService = S3HandlerService;
//# sourceMappingURL=s3-handler.service.js.map