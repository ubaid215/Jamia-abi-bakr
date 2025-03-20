const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

// Load .env file
dotenv.config();

// Define environment variables
const TOKEN = "feb3c85fe526adbd99c37085746bfc5e"; // Hardcoded for now
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// Create Mailtrap client
const mailtrapclient = new MailtrapClient({
  token: TOKEN,
  endpoint: ENDPOINT,
});

// Define sender object
const sender = {
  email: "hello@demomailtrap.co",
  name: "Email Testing for Madrisa",
};

// Export variables
module.exports = {
  mailtrapclient,
  sender,
};