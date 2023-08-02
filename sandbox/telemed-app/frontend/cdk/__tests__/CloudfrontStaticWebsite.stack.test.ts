import {Testing} from 'cdktf';
import 'cdktf/lib/testing/adapters/jest';
import {S3Bucket} from '@cdktf/provider-aws/lib/s3-bucket';
import {S3Object} from '@cdktf/provider-aws/lib/s3-object';
import {CloudFrontStaticWebsiteStack} from '../main';
import {AcmCertificate} from '@cdktf/provider-aws/lib/acm-certificate';
import {AcmCertificateValidation} from '@cdktf/provider-aws/lib/acm-certificate-validation';
import {S3BucketPolicy} from '@cdktf/provider-aws/lib/s3-bucket-policy';
import {Route53Record} from '@cdktf/provider-aws/lib/route53-record';
import {config} from 'dotenv';
import path = require('path');
import {CloudfrontOriginAccessControl} from '@cdktf/provider-aws/lib/cloudfront-origin-access-control';
import {CloudfrontDistribution} from '@cdktf/provider-aws/lib/cloudfront-distribution';

config({path: path.join(__dirname, '../.env')});

describe('CloudfrontStaticWebsiteStack Tests', () => {
  const app = Testing.app();
  const stack = new CloudFrontStaticWebsiteStack(app, 'test');
  const synthesized = Testing.synth(stack);

  it('should create an S3 bucket', () => {
    expect(synthesized).toHaveResource(S3Bucket);
  });

  it('S3 bucket should match name provided in env', () => {
    expect(synthesized).toHaveResourceWithProperties(S3Bucket, {
      bucket: process.env.S3_BUCKET_NAME,
    });
  });

  it('should create an S3 bucket policy', () => {
    expect(synthesized).toHaveResource(S3BucketPolicy);
  });

  it('should create S3 Object', () => {
    expect(synthesized).toHaveResource(S3Object);
  });

  it('should create ACM certificate', () => {
    expect(synthesized).toHaveResource(AcmCertificate);
  });

  it('should create a ACM Certificate Validation', () => {
    expect(synthesized).toHaveResource(AcmCertificateValidation);
  });

  it('should create an route53 record', () => {
    expect(synthesized).toHaveResource(Route53Record);
  });

  it('acm record should match domain name provided in env', () => {
    expect(synthesized).toHaveResourceWithProperties(AcmCertificate, {
      domain_name: process.env.CUSTOM_DOMAIN,
    });
  });

  it('should create a Cloudfront Distribution', () => {
    expect(synthesized).toHaveResource(CloudfrontDistribution);
  });

  it('should create a Cloudfront OAC', () => {
    expect(synthesized).toHaveResource(CloudfrontOriginAccessControl);
  });

  it('should match snapshot test', () => {
    expect(synthesized).toMatchSnapshot();
  });

  it('should produce a valid terraform configuration', () => {
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it('should plan successfully', () => {
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
