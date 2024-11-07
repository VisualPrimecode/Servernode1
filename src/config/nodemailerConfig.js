// src/config/nodemailerConfig.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambia esto si usas otro servicio
  auth: {
    user: process.env.EMAIL_USER, // Tu email desde el cual se enviarán los correos
    pass: process.env.EMAIL_PASS  // Tu contraseña o clave de aplicación
  }
});

module.exports = transporter;
