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

    const resetUrl = `http://localhost:5173/restablecer?token=${token}`;

    const { transporter: mailer, etherealUrl: ethUrl } = await getTransporter();

    const info = await mailer.sendMail({
      from: `"Wishdin" <${process.env.EMAIL_FROM || 'noreply@wishdin.com'}>`,
      to: email,
      subject: 'Restablece tu contraseña - Wishdin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #450C3F, #4D3EA3); padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 1.5rem;">Wishdin</h1>
          </div>
          <div style="background: #fff; padding: 32px 24px; border: 1px solid #e0dede; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #333; font-size: 1rem;">Hola,</p>
            <p style="color: #555; font-size: 0.9rem; line-height: 1.6;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en Wishdin.
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetUrl}"
                 style="background: #4D3EA3; color: #fff; text-decoration: none;
                        padding: 12px 32px; border-radius: 8px; font-weight: bold; font-size: 0.95rem;
                        display: inline-block;">
                Restablecer contraseña
              </a>
            </div>
            <p style="color: #777; font-size: 0.8rem; line-height: 1.5;">
              Si no solicitaste este cambio, ignora este mensaje.
              Este enlace expira en <strong>1 hora</strong>.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 0.75rem;">
              Si el botón no funciona, copia este enlace en tu navegador:<br>
              <a href="${resetUrl}" style="color: #758AD1; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
        </div>
      `
    });

    if (ethUrl) {
      console.log('\n═══════════════════════════════════════════════');
      console.log('  📧 Email enviado vía Ethereal');
      console.log('  📬  Vista previa:', nodemailer.getTestMessageUrl(info));
      console.log('  🔗  O inicia sesión en', ethUrl);
      console.log('     Usuario:', info.envelope.to[0]);
      console.log('═══════════════════════════════════════════════\n');
    } else {
      console.log(`📧 Email enviado a ${email}: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return res.json({ mensaje });
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