import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const timeRange = searchParams.get('timeRange') || '7d';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const now = Date.now();
    let startTime = 0;

    if (timeRange === '7d') {
      startTime = now - 7 * 24 * 60 * 60 * 1000;
    } else if (timeRange === '30d') {
      startTime = now - 30 * 24 * 60 * 60 * 1000;
    } else if (timeRange === '90d') {
      startTime = now - 90 * 24 * 60 * 60 * 1000;
    }

    const command = new QueryCommand({
      TableName: 'hg-activities',
      KeyConditionExpression: 'userId = :userId AND #ts >= :startTime',
      ExpressionAttributeNames: {
        '#ts': 'timestamp',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':startTime': startTime,
      },
      ScanIndexForward: false,
    });

    const response = await docClient.send(command);

    return NextResponse.json({
      success: true,
      data: response.Items || [],
    });
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
