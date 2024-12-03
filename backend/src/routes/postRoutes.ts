import { Router } from "express";
import { countLikes, createPost, toggleLike, addComment, getAllPosts, getFollowingPosts, deletePost, getPostById, getPostsByUserId, uploadMedia} from "../controllers/postController";
import { validateJwt } from "../middlewares/auth";
import multer from 'multer';

const upload = multer({ dest: "uploads/" }); // Configuración de multer para manejar archivos

const router = Router();
/* primero se tiene que subir archivo antes de crear el post
ruta para subir media (requiere autenticación) */
router.post("/upload", validateJwt, upload.single("media"), uploadMedia);

//ruta para crear un post (requiere autenticación)
router.post("/createPost", validateJwt, createPost);

// Ruta para obtener todos los posts (público)
router.get("/getAllPosts", getAllPosts);

//traer los post de los usuarios a los cuales sigo
router.get("/following", validateJwt, getFollowingPosts);

// Ruta para obtener todos los posts de un usuario (requiere autenticación)
router.get("/user", validateJwt, getPostsByUserId); // Nueva ruta

router.delete("/:id", validateJwt, deletePost);
//trae post por id
router.get("/:id", validateJwt, getPostById);

router.post("/comment", validateJwt, addComment);

// Ruta para agregar un like a un post
router.post('/like', validateJwt, toggleLike);
//Cuenta los likes
router.get("/likes/:postId", validateJwt, countLikes);

export default router;
