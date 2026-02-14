<!DOCTYPE html>
<html>

<head>
    <title>Verify Your Email</title>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #2d3748; text-align: center;">Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address.
            This code is valid for 5 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
            <span
                style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4a5568; background: #edf2f7; padding: 10px 20px; border-radius: 5px;">
                {{ $otp }}
            </span>
        </div>
        <p>If you did not request this verification, please ignore this email.</p>
        <p>Best regards,<br>The Garage Management Team</p>
    </div>
</body>

</html>