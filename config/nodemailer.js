const nodemailer = require('nodemailer');

const sender = 'user@example.com' // remove for external mail

const transport = nodemailer.createTransport({
	port: 25,
	host: 'localhost',
	tls: {
		rejectUnauthorized: false
	}
});

module.exports = (recipient,subject,html) => {
	transport.sendMail({
		...(sender ? {from: sender}:{}), // sender only needed for local mail server
		to: recipient,
		subject,
		html
	});
}
