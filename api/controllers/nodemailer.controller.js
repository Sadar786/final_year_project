import nodemailer from 'nodemailer'
// Create a Nodemailer transporter object using Gmail service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:  'bathoorsadarullah@gmail.com' ,
    pass: 'ixbd xmqc cffq qxyr'  // Consider using environment variables for sensitive data
  }

});

export const sendEmail = async (req, res, next) => {
  const { toName, fromName, message, toEmail } = req.body;

  const mailOptions = {
    from: 'bathoorsadarullah@gmail.com' ,
    to: toEmail,
    subject: 'Tailoring Job Status Update',
    text: `Hello ${toName},\n\nYou got a new message from ${fromName}:\n\n${message}\n\nBest wishes,\nYour Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Email sent successfully'});
  } catch (error) {
     res.status(500).send({ error: 'Failed to send email'+ error });
  }
};

