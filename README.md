# CDK S3 Thumbnail

The [Using AWS Lambda with Amazon S3](https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html)
tutorial done with AWS CDK.

Uses the `NodejsFunction` to bundle the Lambda code:
* `aws-sdk` is not included in the bundle
* `sharp`, which uses native dependencies, is installed in the `node_modules` folder

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
