const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Usuario = require('../models/Usuario');
const PasswordResetToken = require('../models/PasswordResetToken');

let transporter = null;
let etherealUrl = null;

async function getTransporter() {
  if (transporter) return { transporter, etherealUrl };

  if (process.env.EMAIL_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    return { transporter, etherealUrl: null };
  }

  if (process.env.NODE_ENV === 'production') {
    return { transporter: null, etherealUrl: null };
  }

  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
  return { transporter, etherealUrl: 'https://ethereal.email/login' };
}

// GEN-04: Registro
const registro = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password: hash });

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GEN-05: Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Perfil (ruta protegida de prueba)
const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GEN-07: Solicitar restablecimiento de contraseña
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El email es obligatorio' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    const mensaje = 'Si el email existe, recibirás un enlace para restablecer tu contraseña';

    if (!usuario) {
      return res.json({ mensaje });
    }

    await PasswordResetToken.update(
      { used: true },
      { where: { usuario_id: usuario.id, used: false } }
    );

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordResetToken.create({
      usuario_id: usuario.id,
      token,
      expires_at: expiresAt
    });

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${baseUrl}/restablecer?token=${token}`;

    return res.json({ mensaje: 'Enlace generado', resetUrl, dev: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GEN-07: Restablecer contraseña
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token y nueva contraseña son obligatorios' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const resetToken = await PasswordResetToken.findOne({
      where: { token, used: false }
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Token inválido o ya utilizado' });
    }

    if (new Date() > new Date(resetToken.expires_at)) {
      return res.status(400).json({ error: 'El token ha expirado' });
    }

    const hash = await bcrypt.hash(password, 10);
    await Usuario.update({ password: hash }, { where: { id: resetToken.usuario_id } });
    await resetToken.update({ used: true });

    return res.json({ mensaje: 'Contraseña restablecida exitosamente' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { registro, login, perfil, forgotPassword, resetPassword };