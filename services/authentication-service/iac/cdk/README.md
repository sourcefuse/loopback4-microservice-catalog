# CDK Module For Lambda

We can use the Cloud Development Kit for Terraform (CDKTF) to define advanced deployment configurations.

CDKTF stacks let us manage multiple Terraform configurations in the same CDKTF application. They can save us from writing repetitive CDKTF code, while allowing us to independently manage the resources in each stack. we can also use the outputs of one stack as inputs for another.

## Getting Started

1. Create a dot env file:  
  ```shell
  touch .env
  ```

3. Configure the following keys in the `.env` file:  
  * **AWS_REGION**: *aws_region*  
  * **AWS_ACCESS_KEY_ID**: *aws_access_key*
  * **AWS_SECRET_ACCESS_KEY**: *aws_secret_key*
  * **AWS_ROLE_ARN**: *role_arn*
  * **AWS_PROFILE**: *aws_profile*
  * **SUBNET_IDS**: *subnet ids eg ["subnet-012", "subnet-123"]* 
  * **SECURITY_GROUPS**: *security group ids eg ["sg-123"]* 
  * **DB_HOST**: *Postgres Database host* 
  * **DB_PORT**: *Postgres Database port* 
  * **DB_USER**: *database username*
  * **DB_PASSWORD**: *database password*
  * **DB_DATABASE**: *database name*
  * **DB_SCHEMA**: *database schema*
  * **JWT_SECRET**: *For JWT token*
  * **ACM_CERTIFICATE_ARN**: *ARN for ACM certificate*
  * **HOSTED_ZONE_ID**: *Route53 hosted zone id*
  * **DOMAIN_NAME**: *custom domain name for api gateway*

  Note: if You want to use * **AWS_ACCESS_KEY_ID** and * **AWS_SECRET_ACCESS_KEY** then keep 
  * **AWS_PROFILE** as blank.

3. Run *npm install* to install the dependency packages for cdktf. Now you are ready to go with cdktf commands.

## How to Run
This module gives us several commands for the aws lambda function. 
* Download all required providers and modules. 
  ```shell
  cdktf get
  ``` 
* List all the stacks defined in your CDKTF application.  
  ```shell
  cdktf list
  ``` 
* To deploy the Elasticache redis *(here sourceloop authentication uses kv-memory connector  by default if you wish to use redis connector then change connector from kv-memory to kv-redis in cache.datasource.ts , install the [package](https://www.npmjs.com/package/loopback-connector-kv-redis) and pass the redis envs to lambda)*
  ```shell
  cdktf deploy redis
  ```
* To deploy the sourceloop authentication in lambda on aws and remember to confirm the deploy with a yes.*(Make sure to run npm run build:layers in root folder to create required lambda layers)*
  ```shell
  cdktf deploy lambda
  ```
* To deploy and run the migration for sourceloop authentication in lambda on aws and remember to confirm the deploy with a yes.*(Make sure to run npm run build:migrations in root folder to create required migrations files)*
  ```shell
  cdktf deploy migration
  ```

* To deploy lambda and migration stack on aws and remember to confirm the deploy with a yes.  
  ```shell
  cdktf deploy '*'
  ```
* To destroy the Infrastructure that you deployed on aws.  
  ```shell
  cdktf destroy lambda
  cdktf destroy migration
  ```
