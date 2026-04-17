const nodemailer = require('nodemailer');

// Création du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction pour envoyer un email de notification
async function sendContactEmail({ name, email, message }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Envoyer à votre propre email
    subject: `Nouveau message de contact de ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Nouveau message de contact</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">${message}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px;">Ce message a été envoyé depuis le portfolio de Samaké DELAMOU</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

// Fonction pour envoyer un email de confirmation à l'expéditeur
async function sendConfirmationEmail({ name, email }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmation de votre message',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Merci pour votre message !</h2>
        <p>Bonjour ${name},</p>
        <p>J'ai bien reçu votre message et je vous répondrai dans les plus brefs délais.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #6b7280;">Cordialement,</p>
          <p style="color: #06b6d4; font-weight: bold;">Samaké DELAMOU</p>
          <p style="color: #6b7280;">Étudiant en informatique L3 - Université de Labé</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmation envoyé');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation:', error);
    return false;
  }
}

module.exports = {
  sendContactEmail,
  sendConfirmationEmail,
};
