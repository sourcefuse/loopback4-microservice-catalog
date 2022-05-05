import { S3WithSigner } from 'loopback4-s3';
export declare class S3HandlerService {
    s3Client: S3WithSigner;
    constructor(s3Client: S3WithSigner);
    listObjects(bucketName: string, contractName: string): Promise<import("@aws-sdk/client-s3")._Object[] | undefined>;
    getObject(bucketName: string, key: string | undefined): Promise<any>;
    streamToString(stream: any): Promise<string>;
}
