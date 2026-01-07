const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const nodemailer = require("nodemailer");

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    // Parse JSON input
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const { firstName, lastName, email, company, subject, message } = body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Store into DynamoDB
    const params = new PutItemCommand({
      TableName: "navstore",
      Item: {
        email_id: { S: email },
        firstName: { S: firstName },
        lastName: { S: lastName },
        company: { S: company || "N/A" },
        subject: { S: subject },
        message: { S: message },
        createdAt: { S: new Date().toISOString() },
      },
    });

    await dynamoClient.send(params);

    // Configure SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: false, // set true if using port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send Welcome Email
    await transporter.sendMail({
      from: `"Navchetna" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to Navchetna!",
      text: `Hi ${firstName}, welcome to Navchetna! We have received your message and will contact you soon.`,
    });

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Contact form submitted successfully and welcome email sent!",
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
