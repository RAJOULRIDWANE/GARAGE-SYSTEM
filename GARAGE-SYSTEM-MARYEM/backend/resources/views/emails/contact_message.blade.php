<!DOCTYPE html>
<html>

<head>
    <title>New Contact Message</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 10px;
        }

        .header {
            background: #005DFF;
            color: #fff;
            padding: 15px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }

        .content {
            padding: 20px;
            border: 1px solid #eee;
            border-top: none;
        }

        .item {
            margin-bottom: 15px;
        }

        .label {
            font-weight: bold;
            color: #005DFF;
            display: block;
            margin-bottom: 5px;
        }

        .value {
            background: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            display: block;
            border: 1px solid #f0f0f0;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8rem;
            color: #888;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h2>MecaPro Garage - New Message</h2>
        </div>
        <div class="content">
            <div class="item">
                <span class="label">Name:</span>
                <span class="value">{{ $details['name'] }}</span>
            </div>
            <div class="item">
                <span class="label">Email:</span>
                <span class="value">{{ $details['email'] }}</span>
            </div>
            <div class="item">
                <span class="label">Phone:</span>
                <span class="value">{{ $details['phone'] }}</span>
            </div>
            <div class="item">
                <span class="label">Message:</span>
                <span class="value">{{ $details['message'] }}</span>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from the MecaPro Garage Website Contact Form.</p>
        </div>
    </div>
</body>

</html>