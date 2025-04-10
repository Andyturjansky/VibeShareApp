import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database/database";
import authRouter from "./routes/authRoutes";
import postRouter from "./routes/postRoutes";
import userRouter from "./routes/userRoutes";
import adRoutes from './routes/adRoutes';
import { PORT } from "./constants";
import fileUpload from "express-fileupload";
const app = express();

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/auth", authRouter);

// Rutas de posts
app.use("/posts", postRouter);

// Rutas users
app.use("/user",userRouter);

// Rutas de ads
app.use('/api/ads', adRoutes);

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});

// Configuración express-fileupload
app.use(fileUpload({
  useTempFiles: true, // Usa archivos temporales
  tempFileDir: "/tmp/", // Define el directorio temporal
}));