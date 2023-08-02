import * as aws from "@cdktf/provider-aws";
import { Construct } from "constructs";

export interface IAcmCertificate {
  domainName: string;
  hostedZoneId: string;
  ttl?: number;
}

export class CreateAcmCertificate extends Construct {
  acmArn: string;
  constructor(scope: Construct, id: string, config: IAcmCertificate) {
    super(scope, id);

    let { domainName, hostedZoneId, ttl } = config;

    const awsAcmCertificate = new aws.acmCertificate.AcmCertificate(
      this,
      "cert",
      {
        domainName,
        validationMethod: "DNS",
        lifecycle: {
          createBeforeDestroy: true,
        },
      }
    );

    ttl = ttl ?? 300;

    const awsRoute53Record = new aws.route53Record.Route53Record(
      this,
      "route53Record",
      {
        allowOverwrite: true,
        name: `\${each.value.name}`,
        records: [`\${each.value.record}`],
        ttl,
        type: `\${each.value.type}`,
        zoneId: hostedZoneId,
      }
    );
    awsRoute53Record.addOverride(
      "for_each",
      `\${\{
      for dvo in ${awsAcmCertificate.terraformResourceType}.${awsAcmCertificate.friendlyUniqueId}.domain_validation_options : dvo.domain_name => {
        name   = dvo.resource_record_name
        record = dvo.resource_record_value
        type   = dvo.resource_record_type
      }
    }}`
    );

    const awsAcmCertificateValidation =
      new aws.acmCertificateValidation.AcmCertificateValidation(
        this,
        "awsAcmCertificateValidation",
        {
          certificateArn: awsAcmCertificate.arn,
        }
      );
    awsAcmCertificateValidation.addOverride(
      "validation_record_fqdns",
      `\${[for record in ${awsRoute53Record.terraformResourceType}.${awsRoute53Record.friendlyUniqueId} : record.fqdn]}`
    );

    this.acmArn = awsAcmCertificateValidation.certificateArn;
  }
}
