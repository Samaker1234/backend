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

// Fonction pour envoyer un email de notification de contact
async function sendContactEmail({ name, email, message }) {
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `Nouveau message de contact de ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: #06b6d4; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Nouveau Message</h2>
        </div>
        <div style="padding: 20px;">
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          Ce message a été envoyé depuis votre portfolio.
        </div>
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
    from: `"Samaké DELAMOU" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Confirmation de votre message',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: #06b6d4; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Merci pour votre message !</h2>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour ${name},</p>
          <p>J'ai bien reçu votre message et je vous répondrai dans les plus brefs délais.</p>
          <p>Cordialement,</p>
          <p style="color: #06b6d4; font-weight: bold; margin: 0;">Samaké DELAMOU</p>
          <p style="font-size: 12px; color: #6b7280;">Étudiant en informatique - Université de Labé</p>
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

// Fonction pour notifier l'ajout d'un projet
async function sendProjectNotification(project) {
  const mailOptions = {
    from: `"Portfolio Samaké" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🚀 Nouveau projet ajouté : ${project.title}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nouveau Projet Publié !</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #111827; margin-top: 0;">${project.title}</h2>
          <span style="background: #ecfeff; color: #0891b2; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${project.category}</span>
          
          <div style="margin-top: 20px; color: #4b5563; line-height: 1.6;">
            <p><strong>Description :</strong></p>
            <p style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #06b6d4;">${project.description}</p>
          </div>

          <div style="margin-top: 20px;">
            <p style="color: #111827; font-weight: bold; margin-bottom: 8px;">Technologies utilisées :</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${project.tools.map(tool => `<span style="background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 4px; font-size: 13px; margin-right: 5px; margin-bottom: 5px; display: inline-block;">${tool}</span>`).join('')}
            </div>
          </div>

          <div style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
            <table width="100%">
              <tr>
                ${project.github_url ? `
                <td align="center">
                  <a href="${project.github_url}" style="display: inline-block; padding: 10px 20px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Code GitHub</a>
                </td>` : ''}
                ${project.demo_url ? `
                <td align="center">
                  <a href="${project.demo_url}" style="display: inline-block; padding: 10px 20px; background-color: #06b6d4; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Voir la Démo</a>
                </td>` : ''}
              </tr>
            </table>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>Cette notification a été générée automatiquement par le backend de votre portfolio.</p>
          <p>© ${new Date().getFullYear()} Samaké DELAMOU</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Notification de projet envoyée avec détails');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la notification de projet:', error);
    return false;
  }
}

// Fonction pour notifier l'ajout d'une compétence
async function sendSkillNotification(skill) {
  const mailOptions = {
    from: `"Portfolio Samaké" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `⭐ Nouvelle compétence ajoutée : ${skill.name}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nouvelle Compétence !</h1>
        </div>
        <div style="padding: 30px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">${skill.icon || '🎯'}</div>
            <h2 style="color: #111827; margin: 0;">${skill.name}</h2>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <div style="margin-bottom: 15px;">
              <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Catégorie</p>
              <p style="color: #111827; margin: 0; font-weight: 600;">${skill.category}</p>
            </div>
            <div>
              <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Niveau de maîtrise</p>
              <div style="width: 100%; background: #e5e7eb; height: 12px; border-radius: 6px; position: relative; margin-top: 10px;">
                <div style="width: ${skill.level}%; background: #8b5cf6; height: 100%; border-radius: 6px;"></div>
              </div>
              <p style="color: #111827; margin: 10px 0 0 0; font-weight: 600; text-align: right;">${skill.level}%</p>
            </div>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>Notification envoyée depuis le système admin de Samaké DELAMOU.</p>
          <p>© ${new Date().getFullYear()} Portfolio</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Notification de compétence envoyée avec détails');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la notification de compétence:', error);
    return false;
  }
}

// Fonction pour notifier une tentative d'intrusion
async function sendSecurityAlert(details) {
  const mailOptions = {
    from: `"Sécurité Portfolio" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `⚠️ ALERTE SÉCURITÉ : Tentatives de connexion suspectes`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #ef4444; border-radius: 12px; overflow: hidden;">
        <div style="background: #ef4444; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Alerte de Sécurité</h2>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour,</p>
          <p>Le système a détecté plusieurs tentatives de connexion échouées sur votre tableau de bord admin.</p>
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #ef4444;">
            <p><strong>Détails :</strong></p>
            <ul>
              <li><strong>Tentatives échouées :</strong> ${details.attempts}</li>
              <li><strong>Dernière tentative :</strong> ${new Date().toLocaleString('fr-FR')}</li>
              <li><strong>Navigateur :</strong> ${details.userAgent || 'Inconnu'}</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Si ce n'était pas vous, nous vous recommandons de rester vigilant.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Alerte de sécurité envoyée');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'alerte de sécurité:', error);
    return false;
  }
}

module.exports = {
  sendContactEmail,
  sendConfirmationEmail,
  sendProjectNotification,
  sendSkillNotification,
  sendSecurityAlert,
};
