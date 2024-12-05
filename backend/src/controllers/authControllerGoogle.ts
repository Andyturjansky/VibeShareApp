import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import { JWT_SECRET, GOOGLE_AUTH } from "../constants";

// Creamos el cliente de OAuth2 usando el WEB CLIENT_ID
const client = new OAuth2Client(GOOGLE_AUTH.WEB.CLIENT_ID);

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  console.log('📱 Iniciando googleLogin...');
  const { token } = req.body;
  console.log('🔑 Token recibido:', token ? 'Token presente' : 'Token ausente');

  try {
    // Obtener la información del usuario usando el access token
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      console.error('❌ Error al obtener información de Google:', response.statusText);
      res.status(401).json({ error: "Token de Google inválido" });
      return;
    }

    const googleUser = await response.json();
    console.log('👤 Información de usuario de Google:', googleUser);
    const { email, name, sub: googleId } = googleUser;

    if (!email) {
      console.error('❌ Email no encontrado en la información de Google');
      res.status(400).json({ error: "El email es requerido" });
      return;
    }

    // Verificar si el usuario ya existe
    let user = await UserModel.findOne({ email });
    
    if (!user) {
      console.log('👥 Usuario nuevo, creando cuenta...');
      // Crear nuevo usuario
      user = new UserModel({
        email,
        name,
        username: email.split('@')[0], // Generamos un username básico desde el email
        googleId // Guardamos el ID de Google para futura referencia
      });
      await user.save();
      console.log('✅ Usuario creado exitosamente');
    } else {
      console.log('✅ Usuario existente encontrado');
    }

    // Crear JWT token
    const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    
    // Devolver respuesta
    console.log('🎉 Login exitoso, enviando respuesta');
    res.status(200).json({ 
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
        surname: user.surname,
        gender: user.gender,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error('❌ Error en googleLogin:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};