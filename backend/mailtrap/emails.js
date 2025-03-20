const { mailtrapclient, sender } = require("./mailtrap.config.js");
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailTemplates.js");

const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });
        console.log("Email sent successfully", response);
        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

const sendWelcomeEmail = async (email, name) => {
    const recipients = [{ email }];
    
    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipients,
            template_uuid: "485d7d90-442b-44ca-816b-083327263cbc", // Template UUID from Mailtrap
            template_variables: {
                "company_info_name": "Auth Company",
                name: name,
            },
        });

        console.log("Email sent successfully", response);
        return { success: true, message: "Welcome email sent successfully" };
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return { success: false, message: "Failed to send welcome email" };
    }
};

const sendForgetEmail = async (email, resetUrl) => {
    const recipients = [{ email }];

    try {
        // Replace the placeholder in the template with the actual reset URL
        const emailContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace(/{resetURL}/g, resetUrl);

        // Send the email
        const response = await mailtrapclient.send({
            from: sender,
            to: recipients,
            subject: "Reset Your Password",
            html: emailContent,
            text: `Hello,\n\nWe received a request to reset your password. If you didn't make this request, please ignore this email.\n\nTo reset your password, click the link below:\n${resetUrl}\n\nIf you cannot click the link, copy and paste it into your browser.\n\nThis link will expire in 1 hour for security reasons.\n\nBest regards,\nYour App Team`
        });

        console.log("Forget password email sent successfully", response);
        return { success: true, message: "Forget password email sent successfully" };
    } catch (error) {
        console.error("Error sending forget password email:", error);
        return { success: false, message: "Failed to send forget password email" };
    }
};

const sendResetPasswordEmail = async (email, resetUrl) => {
    const recipients = [{ email }];

    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipients,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{resetUrl}", resetUrl),
            
        });

        console.log("Your password has been reset successfully", response);
        return { success: true, message: "Your password has been reset successfully" };
    } catch (error) {
        console.error("Error sending freset password email:", error);
        return { success: false, message: "Failed to send res password email" };
    }
};


// Export the functions
module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendForgetEmail,
    sendResetPasswordEmail
};