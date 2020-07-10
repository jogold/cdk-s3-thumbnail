import * as s3 from '@aws-cdk/aws-s3';
import * as s3n from '@aws-cdk/aws-s3-notifications';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';

export class CdkS3ThumbnailStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'SourceBucket');
    const destinationBucket = new s3.Bucket(this, 'DestinationBucket');

    const handler = new lambda.NodejsFunction(this, 'resizer', {
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      nodeModules: ['sharp'],
    });

    sourceBucket.addObjectCreatedNotification(new s3n.LambdaDestination(handler));
    sourceBucket.grantRead(handler);

    handler.addEnvironment('DESTINATION_BUCKET_NAME', destinationBucket.bucketName);
    destinationBucket.grantPut(handler);
  }
}
