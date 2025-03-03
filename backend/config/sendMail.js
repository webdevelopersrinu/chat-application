import SibApiV3Sdk from "sib-api-v3-sdk";

// Suggested code may be subject to a license. Learn more: ~LicenseLog:435906821.
async function SendMail({
  sendeName,
  senderEMail,
  receiverEMail,
  subject,
  resetLink,
}) {
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.SEND_MAIL_AIP_KEY;
  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
  const sender = {
    email: senderEMail,
    name: sendeName,
  };
  const receivers = [
    {
      email: receiverEMail,
    },
  ];
  // Forgot Password HTML Template
  const generateForgotPasswordTemplate = (resetLink) => {
    return `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
                    <p style="font-size: 16px; color: #555;">
                        Hi there,
                    </p>
                    <p style="font-size: 16px; color: #555;">
                        We received a request to reset your password. You can reset it by clicking the button below:
                    </p>
                    <div style="text-align: center; margin: 20px;">
                        <a href="${resetLink}" style="background-color: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                            Reset Password
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #999; text-align: center;">
                        If you did not request this, please ignore this email. Your password will remain unchanged.
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        &copy; 2024 Srinu Support Team. All rights reserved.
                    </p>
                </div>
            </body>
        </html>`;
  };
  await tranEmailApi.sendTransacEmail({
    sender: sender,
    to: receivers,
    subject,
    textContent: `Hi there, 
            We received a request to reset your password. 
            Reset your password using the following link: ${resetLink}.
            If you did not request this, please ignore this email.`,
    htmlContent: generateForgotPasswordTemplate(resetLink),
  });
}

export default SendMail;
