/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
import {config} from 'dotenv';
import * as aws from '@cdktf/provider-aws';
import {Construct} from 'constructs';
import {App, TerraformStack} from 'cdktf';
import {AwsProvider} from '@cdktf/provider-aws/lib/provider';
import {CreateAcmCertificate} from './helper/utils';

config();

export class CloudFrontStaticWebsiteStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const bucketName = process.env.S3_BUCKET_NAME || '';
    const customDomain = process.env.CUSTOM_DOMAIN || '';
    const hostedZoneId = process.env.HOSTED_ZONE_ID || '';
    const relativePathToBuildDir = process.env.RELATIVE_PATH_TO_BUILD_DIR || '../build';

    new AwsProvider(this, 'aws', {
      region: process.env.AWS_REGION || 'us-east-1',
      profile: process.env.AWS_PROFILE || 'default',
    });

    const spaBucket = new aws.s3Bucket.S3Bucket(this, 'spaBucket', {
      bucket: bucketName,
      tags: {
        Terraform: 'true',
        Environment: 'dev',
      },
    });

    const acmCertificate = new CreateAcmCertificate(this, 'acmCertificate', {
      domainName: customDomain,
      hostedZoneId,
    });

    const oac = new aws.cloudfrontOriginAccessControl.CloudfrontOriginAccessControl(this, 'oac', {
      name: `${bucketName}OAC`,
      description: 'Allow CloudFront access to the bucket',
      originAccessControlOriginType: 's3',
      signingBehavior: 'always',
      signingProtocol: 'sigv4',
    });

    const cloudfrontDistribution = new aws.cloudfrontDistribution.CloudfrontDistribution(this, 'websiteDistribution', {
      origin: [
        {
          domainName: spaBucket.bucketRegionalDomainName,
          originId: `S3-${bucketName}`,
          originAccessControlId: oac.id,
        },
      ],
      enabled: true,
      defaultRootObject: 'index.html',
      priceClass: 'PriceClass_200',
      customErrorResponse: [
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
      defaultCacheBehavior: {
        allowedMethods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
        cachedMethods: ['GET', 'HEAD'],
        targetOriginId: `S3-${bucketName}`,
        forwardedValues: {
          queryString: true,
          cookies: {forward: 'none'},
        },
        viewerProtocolPolicy: 'redirect-to-https',
        minTtl: 0,
        defaultTtl: 3600,
        maxTtl: 86400,
        compress: true,
      },
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        },
      },
      viewerCertificate: {
        acmCertificateArn: acmCertificate.acmArn,
        sslSupportMethod: 'sni-only',
        minimumProtocolVersion: 'TLSv1.2_2019',
      },
      aliases: [customDomain],
    });

    new aws.s3BucketPolicy.S3BucketPolicy(this, 'spaBucketPolicy', {
      bucket: spaBucket.id,
      policy: `{
        "Version": "2008-10-17",
        "Id": "PolicyForCloudFrontPrivateContent",
        "Statement": [
            {
                "Sid": "AllowCloudFrontServicePrincipal",
                "Effect": "Allow",
                "Principal": {
                    "Service": "cloudfront.amazonaws.com"
                },
                "Action": "s3:GetObject",
                "Resource": "${spaBucket.arn}/*",
                "Condition": {
                    "StringEquals": {
                        "AWS:SourceArn": "${cloudfrontDistribution.arn}"
                    }
                }
            }
        ]
    }`,
    });

    new aws.route53Record.Route53Record(this, 'route53Record', {
      name: customDomain,
      zoneId: hostedZoneId,
      type: 'A',
      alias: {
        name: cloudfrontDistribution.domainName,
        zoneId: cloudfrontDistribution.hostedZoneId,
        evaluateTargetHealth: false,
      },
    });

    uploadDirectoryToS3(relativePathToBuildDir, spaBucket, '', this);
  }
}

function uploadDirectoryToS3(sourcePath: string, bucket: aws.s3Bucket.S3Bucket, prefix: string, context: Construct) {
  const files = fs.readdirSync(sourcePath);

  for (const file of files) {
    const filePath = path.join(sourcePath, file);
    const fileKey = path.join(prefix, file);

    const fileStats = fs.statSync(filePath);

    if (fileStats.isDirectory()) {
      uploadDirectoryToS3(filePath, bucket, fileKey, context);
    } else {
      new aws.s3Object.S3Object(context, `spaBucketObject-${file}`, {
        bucket: bucket.id,
        key: fileKey,
        source: path.resolve(filePath),
        contentType: mime.contentType(path.extname(file)) || undefined,
      });
    }
  }
}

const app = new App();
new CloudFrontStaticWebsiteStack(app, 'spa-host');
app.synth();
