import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailRecuperarPass from "../helpers/emailRecuperarPass.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;
  const usuario = await Veterinario.findOne({ email });

  if (usuario) {
    const error = new Error("Email ya registrado");
    return res.status(500).json({ msg: error.message });
  }

  try {
    const veterinario = new Veterinario(req.body);
    const veterinarioSave = await veterinario.save();

    emailRegistro({ nombre, email, token: veterinarioSave.token });

    res.json({ msg: "Veterinario registrado" });
  } catch (error) {
    console.error(error);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;

  res.json(veterinario);
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioToken = await Veterinario.findOne({ token });

  if (!usuarioToken) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioToken.token = null;
    usuarioToken.confirmado = true;

    await usuarioToken.save();

    res.json({ msg: "confirmado" });
  } catch (error) {
    res.status(400);
    res.json({ msg: error.message });
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    res.status(403);
    return res.json({ msg: error.message });
  }

  if (!usuario.confirmado) {
    const error = new Error("Cuenta no confirmada");
    res.status(403);
    return res.json({ msg: error.message });
  }

  if (await usuario.comprobarPassword(password)) {
    return res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id),
    });
  } else {
    const error = new Error("Contraseña incorrecta");
    res.status(403);
    return res.json({ msg: error.message });
  }
};

const recuperarPass = async (req, res) => {
  const { email } = req.body;

  const veterinario = await Veterinario.findOne({ email });

  if (!veterinario) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinario.token = generarId();
    await veterinario.save();

    emailRecuperarPass({
      email,
      nombre: veterinario.nombre,
      token: veterinario.token,
    });

    res.json({ msg: "Email enviado con las instrucciones" });
  } catch (error) {
    res.status(400);
    res.json({ msg: error.message });
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Veterinario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(400).json({ msg: error.message });
  }
};
const nuevoPass = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });

  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinario.token = null;
    veterinario.password = password;

    await veterinario.save();
    res.json({ msg: "Password modificado" });
  } catch (error) {
    res.status(400);
    res.json({ msg: error.message });
  }
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);

  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  const { email } = req.body;
  if (veterinario.email !== req.body.email) {
    const existe = await Veterinario.findOne({ email });

    if (existe) {
      const error = new Error("Este email ya esta en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.web = req.body.web;
    veterinario.telefono = req.body.telefono;

    const veterinarioActualizado = await veterinario.save();

    res.status(200).json(veterinarioActualizado);
  } catch (error) {}
};

const actualizarPassword = async (req, res) => {
  const { id } = req.veterinario;
  const { pass1, pass2 } = req.body;

  const veterinario = await Veterinario.findById(id);

  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  if (await veterinario.comprobarPassword(pass1)) {
    veterinario.password = pass2;
    await veterinario.save();

    res.json({ msg: "Password cambiado" });
  } else {
    const error = new Error("El password actual es incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  recuperarPass,
  comprobarToken,
  nuevoPass,
  actualizarPerfil,
  actualizarPassword,
};
