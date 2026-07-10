import { Router } from "express";
import nodemailer from "nodemailer";
import { Contact } from "../models/Contact.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

// Handle form submission
router.post("/", async (req, res): Promise<any> => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    // 1. Save to MongoDB database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2. Dispatch email notification
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const receiver = "vibes.iiitdm@gmail.com";

    let emailSent = false;
    let emailError = "";

    if (host && user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: {
            user,
            pass,
          },
        });

        const mailOptions = {
          from: `"ViBeS Lab Contact Form" <${user}>`,
          to: receiver,
          replyTo: email,
          subject: `📬 New Contact Form Submission - ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\nSubmission Time: ${new Date().toLocaleString()}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h2 style="color: #0d9488; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
              <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
              <div style="background-color: #f9f9f9; border-left: 4px solid #0d9488; padding: 15px; margin-top: 15px; font-style: italic; white-space: pre-wrap;">${message}</div>
              <p style="margin-top: 20px; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
                Sent from the ViBeS Lab website contact form.
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (err: any) {
        console.error("Nodemailer failed to send email:", err.message);
        emailError = err.message;
      }
    } else {
      console.warn("SMTP credentials not fully configured in .env. Skipping email dispatch.");
      emailError = "SMTP credentials missing";
    }

    return res.status(201).json({
      message: "Message saved successfully.",
      savedInDb: true,
      emailSent,
      emailError: emailSent ? undefined : emailError,
      data: newContact,
    });
  } catch (error: any) {
    console.error("Contact submission server error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET all contact messages (Admin Protected)
router.get("/", authenticateToken, async (req, res): Promise<any> => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return res.status(200).json(contacts);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

// UPDATE contact message read status (Admin Protected)
router.put("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json(contact);
  } catch (error: any) {
    return res.status(400).json({ message: "Error updating message", error: error.message });
  }
});

// DELETE a contact message (Admin Protected)
router.delete("/:id", authenticateToken, async (req, res): Promise<any> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
