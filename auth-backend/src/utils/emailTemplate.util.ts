export const buildVerificationEmail = (verifyUrl: string) => {
  return `
    <h2>Verify Your Email Address</h2>
    <p>Thank you for registering.</p>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
    <p>This link will expire.</p>
  `;
};

export const buildPasswordResetEmail = (resetUrl: string) => {
  return `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>This link will expire.</p>
  `;
};
