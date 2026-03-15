require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// ── Static Files & Sections ──────────────────────────────────────────────────
// Serve data and image files
app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/img',  express.static(path.join(__dirname, 'img')));

// Explicitly serve section HTML files (avoids wildcard conflicts)
app.get('/sections/:filename', (req, res) => {
    const file = req.params.filename.endsWith('.html') ? req.params.filename : `${req.params.filename}.html`;
    res.sendFile(path.join(__dirname, 'sections', file));
});

// Serve frontend assets from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// ── Nodemailer Transporter ────────────────────────────────────────────────────
// Uses Gmail SMTP with an App Password (NOT your regular Gmail password).
// Generate an App Password at: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// ── POST /api/contact ─────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // --- Server-side validation ---
    const errors = [];
    if (!name || name.trim().length < 2)        errors.push('Name is required.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
    if (!message || message.trim().length < 10)  errors.push('Message must be at least 10 characters.');

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    // --- Build email ---
    const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
        to: process.env.TO_EMAIL,
        replyTo: `"${name.trim()}" <${email.trim()}>`,
        subject: `[Portfolio] ${subject ? subject.trim() : 'New Contact Form Message'}`,
        text: `
New Contact Form Message
═══════════════════════════

Name:    ${name.trim()}
Email:   ${email.trim()}
Subject: ${subject ? subject.trim() : '(none)'}

Message:
${message.trim()}

═══════════════════════════
Sent from your portfolio contact form.
        `.trim(),
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; color: #1a1a1a; }
    .card { background: #ffffff; border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .badge { display: inline-block; background: #58181F; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
    h2 { margin: 0 0 24px; font-size: 22px; color: #111; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 0; vertical-align: top; }
    td:first-child { width: 90px; font-weight: 700; color: #58181F; }
    .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
    .message-box { background: #f4f4f5; border-radius: 8px; padding: 16px; white-space: pre-wrap; font-size: 15px; line-height: 1.6; }
    .footer { font-size: 12px; color: #aaa; text-align: center; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Portfolio</div>
    <h2>New Contact Form Message</h2>
    <table>
      <tr><td>Name</td><td>${escapeHtml(name.trim())}</td></tr>
      <tr><td>Email</td><td><a href="mailto:${escapeHtml(email.trim())}">${escapeHtml(email.trim())}</a></td></tr>
      <tr><td>Subject</td><td>${escapeHtml(subject ? subject.trim() : '(none)')}</td></tr>
    </table>
    <hr class="divider">
    <p style="font-weight:700;margin-bottom:8px;">Message:</p>
    <div class="message-box">${escapeHtml(message.trim())}</div>
    <div class="footer">Sent from your portfolio contact form · Reply-To: ${escapeHtml(email.trim())}</div>
  </div>
</body>
</html>
        `.trim(),
    };

    // --- Send email with fallback to logging ---
    console.log(`\n📩 Incoming Message from ${name}:`);
    console.log(`   Email:   ${email}`);
    console.log(`   Subject: ${subject || '(none)'}`);
    console.log(`   Message: ${message}\n`);

    try {
        // Only attempt to send if credentials don't look like placeholders
        const isPlaceholder = !process.env.GMAIL_PASS || process.env.GMAIL_PASS.includes('your_app_password');
        
        if (isPlaceholder) {
            console.log('ℹ️  SMTP not configured (using placeholder). Message logged only.');
            return res.status(200).json({ 
                success: true, 
                message: 'Message received (Demo Mode: Logged to console instead of email).' 
            });
        }

        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully.');
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error('❌ Email send error:', err.message);
        console.log('⚠️  Falling back to console logging for this message.');
        
        // Even if email fails, we return success to the user in this "safe" mode
        // but tell them it's a demo/log mode if we want, or just succeed.
        return res.status(200).json({ 
            success: true, 
            message: 'Message received (logged to server console due to SMTP error).' 
        });
    }
});

// ── Helper: escape HTML in email body ────────────────────────────────────────
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Redirect root to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback: serve index.html for any unmatched route (SPA support)
// But only if it doesn't look like a static asset request (file extension)
app.get('*', (req, res) => {
    if (req.url.split('?')[0].includes('.')) {
        return res.status(404).send('Not Found');
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n✅ Portfolio server running at http://localhost:${PORT}/public/\n`);
    console.log('   SMTP user:', process.env.GMAIL_USER || '⚠️  GMAIL_USER not set in .env');
    console.log('   To email:', process.env.TO_EMAIL  || '⚠️  TO_EMAIL not set in .env');
    console.log('   App password:', process.env.GMAIL_PASS ? '✅ set' : '⚠️  GMAIL_PASS not set in .env');
    console.log('');
});
