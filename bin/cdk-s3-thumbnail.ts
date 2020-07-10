#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkS3ThumbnailStack } from '../lib/cdk-s3-thumbnail-stack';

const app = new cdk.App();
new CdkS3ThumbnailStack(app, 'CdkS3ThumbnailStack');
