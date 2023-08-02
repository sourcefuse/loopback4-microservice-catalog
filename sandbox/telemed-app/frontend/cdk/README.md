# Deploying Single-Page Application (SPA) to AWS S3 and CloudFront

This repository contains code that demonstrates how to deploy a Single-Page Application (SPA) to Amazon Web Services (AWS) S3 and CloudFront using Cloud Development Kit for Terraform (CDKTF) for TypeScript. The deployment process involves creating an S3 bucket, configuring CloudFront distribution, setting up DNS with Route 53, and uploading the SPA files to the S3 bucket.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- AWS Account: You need an AWS account to deploy the infrastructure and access the necessary services.
- Node.js and npm: Install Node.js and npm (Node Package Manager) on your local development machine.
- Terraform: Install Terraform CLI on your local development machine.
- AWS CLI: Install AWS CLI and configure it with your AWS credentials.
- Hosted Zone in Route 53: Set up a hosted zone in AWS Route 53 for your custom domain.

## Environment Variables

The deployment process relies on several environment variables. Create a `.env` file in the root directory of the project and set the following environment variables:

| Environment Variable         | Default Value | Description                                                    |
| ---------------------------- | ------------- | -------------------------------------------------------------- |
| `AWS_REGION`                 | `us-east-1`   | AWS region where the infrastructure will be deployed           |
| `AWS_PROFILE`                | `default`     | AWS profile to use for authentication and authorization        |
| `S3_BUCKET_NAME`             | N/A           | Name of the S3 bucket that will store the SPA files            |
| `CUSTOM_DOMAIN`              | N/A           | Custom domain for the SPA                                      |
| `HOSTED_ZONE_ID`             | N/A           | ID of the Route 53 hosted zone for the custom domain           |
| `RELATIVE_PATH_TO_BUILD_DIR` | `../build`    | Relative path to the SPA build directory (default: `../build`) |

If any of the variables are not provided, the default values mentioned above will be used.

## Steps for Deployment

Follow these steps to deploy the SPA to AWS:

1. Navigate to this project (cdk) directory.

2. Install dependencies:

   ```plaintext
   npm install
   ```

3. Generate CDK Constructs for Terraform providers and modules.:

   ```plaintext
   cdktf get
   ```

   Please note that the original project relies solely on the AWS provider, which is installed as an npm dependency. Therefore, when you run `cdktf get`, you may encounter the following message: `default - WARNING: No providers or modules found in 'cdktf.json' config file, therefore cdktf get does nothing.`

   </br>However, if you make any customizations to the code and add additional providers or modules to the `cdktf.json` file, it is important to run `cdktf get` before deploying your stack to AWS. This command ensures that all the required providers and modules are fetched and available for use in your infrastructure deployment.
   </br>

4. Generate the Terraform configuration by running:

   ```plaintext
   cdktf synth
   ```

5. Deploy the infrastructure:

   ```plaintext
    cdktf deploy spa-host
   ```

   This command will use Terraform and CDK to create the necessary resources on AWS based on the code in `main.ts`. The deployment process may take a few minutes to complete.
   </br>Please note that the stack name defined in the `main.ts` file is `spa-host`. If you have made any customizations to the stacks and have multiple stacks defined, it is important to run the `cdktf deploy` command with the appropriate stack name.
   </br>If you have a single stack named `spa-host`, you can simply run `cdktf deploy spa-host` to deploy that specific stack. However, if you have multiple stacks, you need to run `cdktf deploy <stack-name>` for each stack to ensure they are deployed correctly. Replace `<stack-name>` with the actual name of the stack you want to deploy.
   </br>

6. Verify the deployment:

   Once the deployment is successful, you can access your SPA using the custom domain specified in the `CUSTOM_DOMAIN` environment variable.
   </br>Please note that it may take some time for CloudFront to become fully available after deployment, and during this period, you may encounter an `AccessDenied` error. This is a normal part of the CloudFront provisioning process.
   To resolve this issue, I recommend being patient and waiting for approximately 15-20 minutes before accessing your resources through CloudFront. This will allow sufficient time for the necessary configurations and distributions to be set up properly.

## Customization

You can customize the deployment by modifying the `main.ts` file according to your requirements. Update the code to include additional AWS resources or modify the existing ones.

## Cleanup

To clean up and delete the deployed resources from AWS, run the following command:

```plaintext
cdktf destroy spa-host
```

This command will use Terraform to destroy the infrastructure created during the deployment process. Confirm the destruction when prompted.
Please note that if you have made customizations to the code, make sure to replace spa-host with the names of your stacks.

## License

This code is licensed under the MPL-2.0 license.

## References

- [Terraform](https://www.terraform.io/)
- [CDK for Terraform](https://developer.hashicorp.com/terraform/cdktf)
- [CDKTF AWS Provider](https://github.com/cdktf/cdktf-provider-aws)
- [AWS CLI](https://aws.amazon.com/cli/)
