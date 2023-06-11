import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  const info = await transport.sendMail({
    from: "APV - Administrador de Pacientes de Veterinaria",
    to: email,
    subject: "Verifica tu cuenta en APV",
    text: "Comprueba tu cuenta en APV",
    html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
    <p>Tu cuenta ya esta lista, solo debes verificarla en el siguiente enlace: 
    <a href="${process.env.FRONT_URL}/confirmar/${token}">Verificar</a></p>
    
    <p>Si no creaste esta cuenta puedes ignorar este mensaje</p>`,
  });

  console.log("Mensaje enviado: $s", info.messageId);
};

export default emailRegistro;