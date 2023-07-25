const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const oAuth2Client = new google.auth.OAuth2();

const sendInvitationEmail = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token not found' });
      }
      const accessToken = authHeader.split(' ')[1];
  
      const { toEmail, eventName } = req.body;
  
      const credentials = JSON.parse(fs.readFileSync('oauth2_credentials.json'));
      const { client_secret, client_id, refresh_token } = credentials.web;
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: req.userEmail,
          clientId: client_id,
          clientSecret: client_secret,
          refreshToken: refresh_token,
          accessToken: accessToken,
        },
      });
  
      const mailOptions = {
        from: req.userEmail,
        to: toEmail,
        subject: 'Invitation to Event',
        text: `You are invited to the event "${eventName}".`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Invitation email sent successfully' });
    } catch (error) {
      console.error('Error sending invitation email:', error);
      res.status(500).json({ message: 'Failed to send invitation email' });
    }
  };

module.exports = {
  sendInvitationEmail,
};
