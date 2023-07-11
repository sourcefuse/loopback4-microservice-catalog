# CDK Module For Aurora DB

We can use the Cloud Development Kit for Terraform (CDKTF) to define advanced deployment configurations.

CDKTF stacks let us manage multiple Terraform configurations in the same CDKTF application. They can save us from writing repetitive CDKTF code, while allowing us to independently manage the resources in each stack. we can also use the outputs of one stack as inputs for another.

## Getting Started

1. Create a dot env file:  
  ```shell
  touch .env
  ```

3. Configure the following keys in the `.env` file:  
  * **AWS_REGION**: *aws_region*  
  * **AWS_KEY**: *aws_key*   
  * **AWS_ACCESS_KEY_ID**: *aws_access_key*
  * **AWS_SECRET_ACCESS_KEY**: *aws_secret_key*
  * **AWS_ROLE_ARN**: *role_arn*
  * **AWS_PROFILE**: *aws_profile*
  * **SUBNET_IDS**: *subnet ids for db eg ["subnet-012", "subnet-123"]* 
  * **VPC_ID**: *vpc id*
  * **DB_USER**: *database username*
  * **DB_PASSWORD**: *database password*

  Note: if You want to use * **AWS_ACCESS_KEY_ID** and * **AWS_SECRET_ACCESS_KEY** then keep 
  * **AWS_PROFILE** as blank.

3. Run *npm install* to install the dependency packages for cdktf. Now you are ready to go with cdktf commands.

## How to Run
This module gives us several commands for the aws lambda function.  
* To generate the Db module from [terraform-aws-ref-arch-db](https://github.com/sourcefuse/terraform-aws-ref-arch-db).  
  ```shell
  cdktf get 
  ```
* List all the stacks defined in your CDKTF application.  
  ```shell
  cdktf list
  ``` 
* To deploy the lambda stack on aws and remember to confirm the deploy with a yes.  
  ```shell
  cdktf deploy db
  ```
* To destroy the Infrastructure that you deployed on aws.  
  ```shell
  cdktf destroy db
  ```
