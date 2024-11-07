// src/controllers/contactController.js
const transporter = require('../config/nodemailerConfig'); // Importa la configuración de Nodemailer
// Supongamos que tienes una función para guardar datos en la base de datos
const ContactModel = require('../models/ContactModel');

// Función para enviar correo al administrador
const sendAdminNotification = async (contactData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'admin@tu-sitio.com', // Correo del administrador
    subject: `Nueva solicitud de contacto de ${contactData.nombre}`,
    text: `
      Has recibido una nueva solicitud de contacto:
      Nombre: ${contactData.nombre}
      Email: ${contactData.email}
      Asunto: ${contactData.asunto}
      Mensaje: ${contactData.mensaje}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado al administrador');
  } catch (error) {
    console.error('Error al enviar el correo al administrador:', error);
  }
};

// Función para enviar correo de confirmación al usuario
const sendUserConfirmation = async (contactData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: contactData.email, // El email del usuario
    subject: `Gracias por contactarnos, ${contactData.nombre}`,
    text: `
      Hola ${contactData.nombre},
      Gracias por tu mensaje. Nos pondremos en contacto contigo lo antes posible.
      
      Aquí está una copia de tu mensaje:
      Asunto: ${contactData.asunto}
      Mensaje: ${contactData.mensaje}

      Saludos,
      El equipo de Ejemplo.com
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo de confirmación enviado al usuario');
  } catch (error) {
    console.error('Error al enviar el correo al usuario:', error);
  }
};

// Controlador para manejar la solicitud de contacto
const handleContactForm = async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  try {
    // Guardar los datos en la base de datos
    const contactData = { nombre, email, asunto, mensaje, fecha: new Date() };
    await ContactModel.create(contactData);

    // Enviar correos
    await sendAdminNotification(contactData);
    await sendUserConfirmation(contactData);

    // Responder al cliente con éxito
    res.status(200).json({ message: 'Solicitud enviada correctamente, correos enviados.' });
  } catch (error) {
    console.error('Error al procesar la solicitud de contacto:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud. Por favor, inténtalo más tarde.' });
  }
};

module.exports = { handleContactForm };
