const { createTransporter } = require('../../config/mail');

class ContactController {
  async submitContactForm(req, res, next) {
    try {
      const { name, email, subject, message } = req.body;

      // Validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
      }

      const transporter = createTransporter();

      // Send email to admin
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      // Send confirmation email to user
      const confirmationMail = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting HomeHive',
        html: `
          <h2>Thank you for reaching out!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong></p>
          <p>${message}</p>
          <br>
          <p>Best regards,</p>
          <p>HomeHive Team</p>
        `,
      };

      await transporter.sendMail(confirmationMail);

      res.status(200).json({
        success: true,
        message: 'Message sent successfully',
      });
    } catch (error) {
      console.error('Contact Form Error:', error);
      next(error);
    }
  }
}

module.exports = new ContactController();
