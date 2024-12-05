import { Request, Response } from "express";
import PostModel from "../models/postModel";;
import { JwtPayload } from "jsonwebtoken";
import cloudinary from "../constants/index";
import mongoose from "mongoose";
import User from "../models/userModel";
import Post from "../models/postModel";

// Controlador para subir una imagen o video a Cloudinary
export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No se ha subido ningún archivo" });
      return;
    }

    // Subir el archivo a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // Permite subir imágenes o videos
    });

    // Devolver la URL del archivo subido
    res.status(200).json({ url: result.secure_url, type: result.resource_type });
  } catch (error) {
    console.error("Cloudinary Error:", error); // Log para ver el error exacto
    res.status(500).json({ error: "Error al subir el archivo a Cloudinary", details: error });
  }
};

/* Controlador para crear un post
Se tiene que subir la imagen primero y luego utilizamos crearPost. */
// Controlador para crear un post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as JwtPayload | undefined;

    if (!user || typeof user === "string" || !user.id) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }

    const userId = user.id;
    const { title, location, media } = req.body; // `media` incluye la URL obtenida desde Cloudinary

    const newPost = new PostModel({
      user: userId,
      title,
      date: new Date(),
      location,
      media, // Almacena la URL y el tipo en el array de `media`
      comments: [],
      likes: [],
    });

    await newPost.save();

    res.status(201).json({ message: "Post creado con éxito", post: newPost });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el post", details: error });
  }
};

// Controlador para obtener todos los posts
//ordernar por fecha lo mas nuevos primeros
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find()
      .populate("user", "username profilePicture") // Obtenemos todos los posts y poblamos el campo de usuario
      .populate('comments.user', 'username') // Añadir esta línea
      .sort({ date: -1 }); // Ordenamos por fecha de manera descendente (de más nuevo a más viejo)
      
    res.status(200).json(posts);  // Enviamos los posts en la respuesta
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los posts" });
  }
};
// Controlador para traer los post de users a los cuales sigo
export const getFollowingPosts = async (req: Request, res: Response) => {
  try {
    // Verifica si el middleware de autenticación agregó `req.user`
    const userId = req.user?.id; // `id` fue definido en el token

    if (!userId) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return 
    }

    // Busca al usuario autenticado para obtener su lista de `following`
    const user = await User.findById(userId).select("following");
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return 
    }

    // Busca posts de los usuarios que sigue
    const posts = await Post.find({ user: { $in: user.following } })
      .populate("user", "username profilePicture") // Obtenemos todos los posts y poblamos el campo de usuario
      .populate('comments.user', 'username') // Añadir esta línea
      .sort({ date: -1 }); // Ordenamos por fecha de manera descendente (de más nuevo a más viejo)

    res.status(200).json(posts);
    return 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los posts" });
    return 
  }
};

// Controlador para obtener un post por su ID
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId).populate("user", "username profilePicture");
    if (!post) {
      res.status(404).json({ message: "Post no encontrado" });
      return
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el post" });
  }
};

// Controlador para obtener todos los posts de un usuario específico
export const getPostsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as JwtPayload | undefined;

    if (!user || typeof user === "string" || !user.id) {
      res.status(401).json({ message: "No autorizado" });
      return; // Termina la función aquí
    }

    const userId = user.id;
    const posts = await PostModel.find({ user: userId }) // Buscamos los posts del usuario
    .populate("user", "username profilePicture") // Obtenemos todos los posts y poblamos el campo de usuario
    .populate('comments.user', 'username') // Añadir esta línea
    .sort({ date: -1 }); // Ordenamos por fecha de manera descendente (de más nuevo a más viejo)

    res.status(200).json(posts); // Enviamos los posts en la respuesta
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los posts del usuario" });
  }
};

// Controlador para eliminar un post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
      const postId = req.params.id;
      const user = req.user as JwtPayload | undefined;
  
      if (!user || typeof user === "string" || !user.id) {
        res.status(401).json({ message: "No autorizado" });
        return; // Termina la función aquí
      }
  
      const post = await PostModel.findById(postId);
  
      if (!post) {
        res.status(404).json({ message: "Post no encontrado" });
        return; // Termina la función aquí
      }
  
      // Solo el usuario que creó el post puede eliminarlo
      if (post.user.toString() !== user.id) {
        res.status(403).json({ message: "No tienes permiso para eliminar este post" });
        return; // Termina la función aquí
      }
  
      await post.deleteOne();
      res.status(200).json({ message: "Post eliminado con éxito" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el post" });
    }
  };

  export const toggleLike = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.body;
    const userId = req.user?.id; // Asegúrate de que req.user tenga id
  
    if (!postId || !userId) {
      res.status(400).json({ message: "Faltan datos requeridos" });
      return;
    }
  
    try {
      const post = await PostModel.findById(postId);
  
      if (!post) {
        res.status(404).json({ message: "Post no encontrado" });
        return;
      }
  
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
  
      const username = user.username;
  
      // Verifica si el usuario ya ha dado like
      const userHasLiked = post.likes.some(
        (like) => like.userId.toString() === userId.toString() // Cambiado a userId
      );
  
      if (userHasLiked) {
        // Si ya ha dado like, lo eliminamos
        post.likes = post.likes.filter(
          (like) => like.userId.toString() !== userId.toString() // Cambiado a userId
        );
        post.likeCount -= 1;
        await post.save();
        res.status(200).json({ message: "Like eliminado", likeCount: post.likeCount });
      } else {
        // Si no ha dado like, lo agregamos con userId y username
        post.likes.push({ userId, username });
        post.likeCount += 1;
        await post.save();
        res.status(200).json({ message: "Like agregado", likeCount: post.likeCount });
      }
    } catch (error) {
      console.error("Error al actualizar like:", error);
      res.status(500).json({ error: "Error al actualizar like", details: error });
    }
  };
  
// Servicio para contar los likes de un post
export const countLikes = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;  // Recibimos el postId desde los parámetros de la URL

  try {
    // Buscar el post en la base de datos por su ID
    const post = await Post.findById(postId);

    // Si el post no existe, respondemos con un error
    if (!post) {
      res.status(404).json({ message: "Post no encontrado" });
      return;
    }

    // Contamos la cantidad de likes
    const likeCount = post.likes.length;

    // Respondemos con la cantidad de likes
    res.status(200).json({ likeCount });
  } catch (error) {
    console.error("Error al contar likes:", error);
    res.status(500).json({ error: "Error al contar los likes", details: error });
  }
};


export const addComment = async (req: Request, res: Response): Promise<void> => {
  const { postId, text } = req.body; // Obtén el ID del post y el texto del comentario
  const userId = req.user?.id; // ID del usuario autenticado

  if (!postId || !text || !userId) {
      res.status(400).json({ message: "Faltan datos requeridos" });
      return ;
  }

  try {
      // Crea el nuevo comentario
      const comment = {
          user: userId,
          text,
          date: new Date(),
      };

      // Agrega el comentario al post
      const updatedPost = await PostModel.findByIdAndUpdate(
          postId,
          { $push: { comments: comment } },
          { new: true, useFindAndModify: false }
      )
      .populate("user", "username profilePicture")
      .populate("comments.user", "name username"); // Poblamos el usuario del comentario

      if (!updatedPost) {
          res.status(404).json({ message: "Post no encontrado" });
          return;
      }

      res.status(200).json({ message: "Comentario agregado", post: updatedPost });
  } catch (error) {
      console.error("Error al agregar comentario:", error);
      res.status(500).json({ error: "Error al agregar comentario", details: error });
  }
};