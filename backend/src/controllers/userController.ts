import { Request, Response } from "express";
import User from "../models/userModel";
import cloudinary from "../constants/index";
import Post from "../models/postModel";

//busca usuario por nombre y apellido
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  const { name, surname, username } = req.query;

  // Validación de parámetros
  if ((!name || typeof name !== "string") && 
      (!surname || typeof surname !== "string") && 
      (!username || typeof username !== "string")) {
    res.status(400).json({ 
      message: "Debes proporcionar al menos 'name', 'surname' o 'username', y deben ser cadenas de texto." 
    });
    return;
  }

  try {
    // Construimos la consulta dinámica según los parámetros proporcionados
    const searchCriteria: Record<string, any> = {};

    if (name) {
      searchCriteria.name = { $regex: name, $options: "i" }; // Búsqueda parcial e insensible a mayúsculas
    }
    if (surname) {
      searchCriteria.surname = { $regex: surname, $options: "i" };
    }
    if (username) {
      searchCriteria.username = { $regex: username, $options: "i" };
    }

    // Realizamos la búsqueda con los criterios dinámicos
    const users = await User.find(searchCriteria);

    if (users.length === 0) {
      res.status(404).json({ message: "No se encontraron usuarios que coincidan con los criterios de búsqueda." });
      return;
    }

    res.status(200).json(users); // Devuelve la lista de usuarios encontrados
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    res.status(500).json({ error: "Error al buscar usuarios", details: error });
  }
};


// Controlador para obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.find().select("-password"); // Excluye el campo `password` por seguridad
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los usuarios", details: error });
    }
  };
  
  // Controlador para obtener un usuario en particular por ID
  export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id).select("-password"); // Excluye el campo `password`
      
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el usuario", details: error });
    }
};  




// Actualiza solo los datos de texto del perfil del usuario
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "No autorizado" });
            return;
        }

        const updatedData = req.body;
        const allowedUpdates = ["name", "surname", "username", "bio", "gender"];
        const updates = Object.keys(updatedData).filter(field => allowedUpdates.includes(field));

        if (updates.length === 0) {
            res.status(400).json({ message: "No se especificaron campos válidos para actualizar." });
            return;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        res.status(200).json({ message: "Perfil actualizado con éxito", user });
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ error: "Error al actualizar el perfil", details: error });
    }
};

// Subir la imagen de perfil a Cloudinary
export const uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "No autorizado" });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: "No se subió ninguna imagen de perfil" });
            return;
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "user_profiles",
        });

        const user = await User.findByIdAndUpdate(userId, { profilePicture: uploadResult.secure_url }, { new: true });

        res.status(200).json({ message: "Imagen de perfil actualizada con éxito", user });
    } catch (error) {
        console.error("Error al subir la imagen de perfil:", error);
        res.status(500).json({ message: "Error al subir la imagen de perfil", details: error });
    }
};

// Subir la imagen de portada a Cloudinary
export const uploadCoverPicture = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "No autorizado" });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: "No se subió ninguna imagen de portada" });
            return;
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "user_profiles",
        });

        const user = await User.findByIdAndUpdate(userId, { coverPicture: uploadResult.secure_url }, { new: true });

        res.status(200).json({ message: "Imagen de portada actualizada con éxito", user });
    } catch (error) {
        console.error("Error al subir la imagen de portada:", error);
        res.status(500).json({ message: "Error al subir la imagen de portada", details: error });
    }
};





// Controlador para seguir a otro usuario
export const followUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // ID del usuario autenticado
    const targetUsername = req.params.username; // Username del usuario a seguir

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    if (!targetUsername) {
      res.status(400).json({ message: "Username del usuario a seguir es requerido" });
      return;
    }

    // Buscar al usuario objetivo por su username
    const targetUser = await User.findOne({ username: targetUsername });
    if (!targetUser) {
      res.status(404).json({ message: "Usuario a seguir no encontrado" });
      return;
    }

    if (userId === targetUser.id) {
      res.status(400).json({ message: "No puedes seguirte a ti mismo" });
      return;
    }

    // Agregar al usuario objetivo a la lista de "following" del usuario autenticado
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: targetUser.id } }, // Evitar duplicados
      { new: true } // Devolver el documento actualizado
    );

    // Agregar al usuario autenticado a la lista de "followers" del usuario objetivo
    await User.findByIdAndUpdate(
      targetUser.id,
      { $addToSet: { followers: userId } }, // Evitar duplicados
      { new: true } // Devolver el documento actualizado
    );

    res.status(200).json({
      message: "Usuario seguido con éxito",
      following: updatedUser?.following,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al seguir al usuario", details: error });
  }
};

// Controlador para dejar de seguir a otro usuario
export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // ID del usuario autenticado
    const targetUsername = req.params.username; // Username del usuario a dejar de seguir

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    if (!targetUsername) {
      res.status(400).json({ message: "Username del usuario a dejar de seguir es requerido" });
      return;
    }

    // Buscar al usuario objetivo por su username
    const targetUser = await User.findOne({ username: targetUsername });
    if (!targetUser) {
      res.status(404).json({ message: "Usuario a dejar de seguir no encontrado" });
      return;
    }

    if (userId === targetUser.id) {
      res.status(400).json({ message: "No puedes dejar de seguirte a ti mismo" });
      return;
    }

    // Eliminar al usuario objetivo de la lista de "following" del usuario autenticado
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { following: targetUser.id } },
      { new: true } // Devolver el documento actualizado
    );

    // Eliminar al usuario autenticado de la lista de "followers" del usuario objetivo
    await User.findByIdAndUpdate(
      targetUser.id,
      { $pull: { followers: userId } },
      { new: true } // Devolver el documento actualizado
    );

    res.status(200).json({
      message: "Usuario dejado de seguir con éxito",
      following: updatedUser?.following,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al dejar de seguir al usuario", details: error });
  }
};


//trae a las personas que un usuario sigue
export const getUserFollowers = async (req: Request, res: Response): Promise<void> => {
  try {
    const targetUsername = req.params.username; // Obtén el username del usuario

    // Verifica si el username está presente
    if (!targetUsername) {
      res.status(400).json({ message: "El username del usuario es necesario" });
      return;
    }

    // Busca al usuario objetivo por su username
    const targetUser = await User.findOne({ username: targetUsername });

    if (!targetUser) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const targetUserId = targetUser.id;

    // Busca todos los usuarios que tienen al targetUserId en su lista de seguidores
    const followers = await User.find({ following: targetUserId }).select(
      "_id username name surname profilePicture"
    );

    if (followers.length === 0) {
      res.status(404).json({ message: "Este usuario no tiene seguidores aún." });
      return;
    }

    res.status(200).json({ followers });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los seguidores del usuario", details: error });
  }
};

  

export const getUserFollowing = async (req: Request, res: Response): Promise<void> => {
  try {
    const targetUsername = req.params.username; // Obtén el username del usuario

    // Verifica si el username está presente
    if (!targetUsername) {
      res.status(400).json({ message: "El username del usuario es necesario" });
      return;
    }

    // Busca al usuario objetivo por su username
    const user = await User.findOne({ username: targetUsername }).select("following");

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    // Busca los usuarios que están en la lista de 'following' de este usuario
    const following = await User.find({ _id: { $in: user.following } }).select(
      "_id username name surname profilePicture"
    );

    if (following.length === 0) {
      res.status(404).json({ message: "Este usuario no sigue a nadie." });
      return;
    }

    res.status(200).json({ following });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las personas que sigue el usuario", details: error });
  }
};
  
  


  






  ///A partir de acá manejamos la lista de favoritos

  // Agregar post a favoritos
export const addPostToFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
    const userId = req.user?.id; // Obtén el ID del usuario autenticado
    const postId = req.params.postId; // Obtén el ID del post desde los parámetros de la solicitud

    // Verifica si el post existe
    const postExists = await Post.findById(postId);
    if (!postExists) {
        res.status(404).json({ message: "Post no encontrado" });
        return;
    }

    // Agrega el post a la lista de favoritos del usuario
    const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: postId } }, // Usa $addToSet para evitar duplicados
        { new: true }
    );

    if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
    }

    res.status(200).json({ message: "Post agregado a favoritos", favorites: user.favorites });
    } catch (error) {
    console.error("Error al agregar post a favoritos:", error);
    res.status(500).json({ error: "Error al agregar post a favoritos", details: error });
    }
};

// Quitar post de favoritos
export const removePostFromFavorites = async (req: Request, res: Response): Promise<void> => {
try {
    const userId = req.user?.id; // Obtén el ID del usuario autenticado
    const postId = req.params.postId; // Obtén el ID del post desde los parámetros de la solicitud

    // Quita el post de la lista de favoritos del usuario
    const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { favorites: postId } }, // Usa $pull para eliminar el post de favoritos
        { new: true }
    );

    if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
    }

    res.status(200).json({ message: "Post quitado de favoritos", favorites: user.favorites });
} catch (error) {
    console.error("Error al quitar post de favoritos:", error);
    res.status(500).json({ error: "Error al quitar post de favoritos", details: error });
}
};

export const getUserFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params; // Obtener el username de los parámetros de la URL

    // Verificar que el username esté presente
    if (!username) {
      res.status(400).json({ message: "El parámetro 'username' es requerido" });
      return;
    }

    // Buscar al usuario por su username
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    // Buscar los posts cuyos _id estén en el campo 'favorites' del usuario
    const favorites = await Post.find({
      _id: { $in: user.favorites },
    })
    .populate('user', '_id username profilePicture') // Populate del usuario que creó el post
    .populate('comments.user', 'username') // Populate de los usuarios en los comentarios
    .sort({ date: -1 }); // Ordenar por fecha, más recientes primero

    // Devuelve los favoritos encontrados
    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error al obtener los favoritos del usuario:", error);
    res.status(500).json({
      error: "Error al obtener los favoritos del usuario",
      details: error,
    });
  }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: "ID de usuario no proporcionado" });
      return;
    }

    // 1. Eliminamos al usuario de las relaciones de otros usuarios
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );

    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    await User.updateMany(
      { favorites: { $in: userId } },
      { $pull: { favorites: userId } }
    );

    // 2. Obtener los posts del usuario y eliminar medios en Cloudinary
    const userPosts = await Post.find({ user: userId });

    for (const post of userPosts) {
      for (const media of post.media) {
        if (media.public_id) {
          await cloudinary.uploader.destroy(media.public_id);
        }
      }
    }

    // 3. Eliminamos posts del usuario
    await Post.deleteMany({ user: userId });

    // 4. Eliminamos comentarios del usuario en posts de otros usuarios
    await Post.updateMany(
      { "comments.user": userId },
      { $pull: { comments: { user: userId } } }
    );

    // 5. Eliminamos al usuario
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Cuenta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
//contador de post, seguidores, seguidos, comentarios
export const getUserStats = async (req: any, res: any) => {
  try {
    const { username } = req.params; // Obtener el username de los parámetros de la URL

    // Buscar usuario por username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userId = user._id;

    // Contar posts
    const postCount = await Post.countDocuments({ user: userId });

    // Contar seguidores y seguidos
    const followerCount = user.followers.length;
    const followingCount = user.following.length;

    // Contar comentarios
    const commentCount = await Post.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.user": userId } },
      { $count: "totalComments" },
    ]);

    res.status(200).json({
      postCount,
      followerCount,
      followingCount,
      commentCount: commentCount[0]?.totalComments || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener contador"});
  }
};


