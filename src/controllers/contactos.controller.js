import {getConnection} from '../database/connection.js'
import sql from 'mssql'

    export const getResp = async (req, res) => {
        const pool = await getConnection()
        const result = await pool.request().query('SELECT * FROM mensajes')
        res.send(result.recordset);
    };

    export const obtResp = async (req, res)=> {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .query("SELECT * FROM Mensajes WHERE id_mensaje = @id");
        if (result.rowsAffected[0]===0){
            return res.status(404).json({message: "mensaje no encontrado"});
        }
        return res.json(result.recordset[0]);
    };

    

    export const actResp = async (req, res) => {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id", sql.Int, req.params.id)
            .input("mensaje", sql.VarChar, req.body.mensaje)
            .input("fecha", sql.DateTime, req.body.fecha)
            .query (
                "UPDATE Mensajes SET mensaje = @mensaje, fecha = @fecha WHERE id_mensaje = @id"
            );

        if (result.rowsAffected[0]===0){
            return res.status(404).json({message:"mensaje no encontrado"})
        }
        res.json({
            id: req.params.id,
            mensaje: req.body.mensaje,
            fecha: req.body.fecha
        })
            
    };
    
    export const delResp =  async (req,res)=> {
        const pool = await getConnection()
        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query("DELETE FROM Mensajes where id_mensaje = @id");
        console.log(result);
        if (result.rowsAffected[0]===0){
            return res.status(404).json({message: "Mensaje not found"});
        }
        return res.json({message: "Mensaje Eliminado"})
    };
    /*MANEJO DEL LOS CORREOS INGRESADOS */
    import nodemailer from 'nodemailer';

// Función para enviar correos usando nodemailer
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

// Crear una nueva respuesta (Solicitud de contacto)
export const crearResp = async (req, res) => {
    const { nombre, apellido, correo, numero, mensaje } = req.body;
  
    // Verificar que todos los campos están presentes
    if (nombre && apellido && correo && numero && mensaje) {
      try {
        const pool = await getConnection();
        const result = await pool
          .request()
          .input('nombre', nombre)
          .input('apellido', apellido) // Añadir apellido
          .input('correo', correo)
          .input('numero', numero) // Añadir número de teléfono
          .input('mensaje', mensaje)
          .query('INSERT INTO Contactos (nombre, apellido, correo, numero, mensaje) VALUES (@nombre, @apellido, @correo, @numero, @mensaje)');
  
        // Enviar correo de confirmación al usuario
        await sendEmail(
          correo, // Correo del usuario que envió la solicitud
          'Confirmación de Contacto', // Asunto del correo
          `Hola ${nombre} ${apellido},\n\nGracias por contactarnos. Hemos recibido tu mensaje:\n\n"${mensaje}"\n\nNos pondremos en contacto contigo pronto.`
        );
  
        // Enviar correo de notificación al administrador
        await sendEmail(
          'claudior.ortega98@gmail.com', // Correo del administrador
          'Nueva Ingreso de Contacto', // Asunto del correo
          `Has recibido una nueva solicitud de contacto de ${nombre} ${apellido} (${correo}, Tel: ${numero}):\n\n"${mensaje}".`
        );
  
        res.json({ message: 'Solicitud creada y correos enviados' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la solicitud' });
      }
    } else {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
  };/*
    export const crearResp = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('apellido', sql.VarChar, req.body.apellido)
            .input('numero', sql.VarChar, req.body.numero)
            .input('correo', sql.VarChar, req.body.correo)
            .input('mensaje', sql.VarChar, req.body.mensaje)
            // La fecha es automática en la base de datos, pero se puede incluir si se proporciona
            .input('fecha', sql.DateTime, req.body.fecha || null) // Si no hay fecha, se usará la de la base de datos (GETDATE)
            .input('estado', sql.VarChar, req.body.estado || 'nuevo') // Si no se envía el estado, usará 'nuevo'
            .query('INSERT INTO Contactos (nombre, apellido, numero, correo, mensaje, fecha, estado) ' +
                   'VALUES (@nombre, @apellido, @numero, @correo, @mensaje, ISNULL(@fecha, GETDATE()), @estado); ' +
                   'SELECT SCOPE_IDENTITY() AS id;');
        
        console.log(result);

        // Responder con el ID y los datos insertados
        res.json({
            id: result.recordset[0].id,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            numero: req.body.numero,
            correo: req.body.correo,
            mensaje: req.body.mensaje,
            fecha: req.body.fecha || new Date().toISOString(), // Si no se proporciona la fecha, devolver la actual
            estado: req.body.estado || 'nuevo'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al insertar el contacto.');
    }
    };
    * ANtIGUO CREAR CONTACTO SIN ENVIO DE EMAIL*/