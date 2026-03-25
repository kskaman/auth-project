export const buildVerificationEmail = (verifyUrl: string) => {
  return `
    <h2>Verify Your Email Address</h2>
    <p>Thank you for registering.</p>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
    <p>This link will expire.</p>
  `;
};
