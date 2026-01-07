const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const fs = require('fs');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const { email, website } = JSON.parse(event.body);
    
    // Store in DynamoDB
    await dynamodb.put({
      TableName: 'your-table-name',
      Item: {
        email,
        website,
        timestamp: new Date().toISOString()
      }
    }).promise();

    // Send email - MUST await this
    const template = fs.readFileSync('/opt/template.html', 'utf8');
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Natraj',
      html: template
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Success' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed' })
    };
  }
};