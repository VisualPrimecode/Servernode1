import { getConnection } from '../database/connection.js';
import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  
  // Configuración de transporte de Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio de correo que uses, por ejemplo 'hotmail', 'yahoo', etc.
    auth: {
      user: 'claudior.ortega98@gmail.com', // Coloca aquí el correo desde el cual se enviarán los correos
      pass: 'ylvi yyjb hfon otfj', // Coloca aquí la contraseña del correo
    },
  });

  // Opciones del correo
  const mailOptions = {
    from: 'claudior.ortega98@gmail.com', // El correo que envía (puede ser el mismo del auth)
    to: to, // El destinatario del correo
    subject: subject, // Asunto del correo
    text: text, // Cuerpo del correo en texto plano
  };

  // Enviar correo
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ' + info.response);
  } catch (error) {
    console.error('Error enviando correo:', error);
  }
};
// Obtener todos los mensajes
export const getResp = async (req, res) => {
    const client = await getConnection();
    try {
        const result = await client.query('SELECT * FROM Contactos');
        res.send(result.rows);
    } finally {
        client.release(); // Liberar la conexión
    }
};

// Obtener un mensaje específico por ID
export const obtResp = async (req, res) => {
    const client = await getConnection();
    try {
        const result = await client.query(
            'SELECT * FROM Mensajes WHERE id_mensaje = $1',
            [req.params.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "mensaje no encontrado" });
        }
        return res.json(result.rows[0]);
    } finally {
        client.release();
    }
};

// Actualizar un mensaje por ID
export const actResp = async (req, res) => {
    const client = await getConnection();
    try {
        const result = await client.query(
            'UPDATE Mensajes SET mensaje = $1, fecha = $2 WHERE id_mensaje = $3',
            [req.body.mensaje, req.body.fecha, req.params.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "mensaje no encontrado" });
        }
        res.json({
            id: req.params.id,
            mensaje: req.body.mensaje,
            fecha: req.body.fecha,
        });
    } finally {
        client.release();
    }
};

// Eliminar un mensaje por ID
export const delResp = async (req, res) => {
    const client = await getConnection();
    try {
        const result = await client.query(
            'DELETE FROM Mensajes WHERE id_mensaje = $1',
            [req.params.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Mensaje no encontrado" });
        }
        return res.json({ message: "Mensaje Eliminado" });
    } finally {
        client.release();
    }
};

// Crear una nueva respuesta (Solicitud de contacto)
export const crearResp = async (req, res) => { 
  const datos = req.body;
  const { nombre, apellido, correo, numero, mensaje } = datos;

  // Verificar que todos los campos están presentes
  if (nombre && apellido && correo && numero && mensaje) {
      const client = await getConnection();
      try {
          await client.query(
              'INSERT INTO Contactos (nombre, apellido, correo, numero, mensaje) VALUES ($1, $2, $3, $4, $5)',
              [nombre, apellido, correo, numero, mensaje]
          );

          // Enviar correo de confirmación al usuario
          await sendEmail(
              correo,
              'Confirmación de Contacto',
              `Hola ${nombre} ${apellido},\n\nGracias por contactarnos. Hemos recibido tu mensaje:\n\n"${mensaje}"\n\nNos pondremos en contacto contigo pronto.`
          );

          // Enviar correo de notificación al administrador
          await sendEmail(
              'claudior.ortega98@gmail.com',
              'Nueva Ingreso de Contacto',
              `Has recibido una nueva solicitud de contacto de ${nombre} ${apellido} (${correo}, Tel: ${numero}):\n\n"${mensaje}".`
          );

          res.json({ message: 'Solicitud creada y correos enviados' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error al crear la solicitud' });
      } finally {
          client.release();
      }
  } else {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
  }
};
