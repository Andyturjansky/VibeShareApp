import mongoose, { Schema, Document } from "mongoose";

interface IComment {
  user: mongoose.Schema.Types.ObjectId;
  text: string;
  date: Date;
}

interface IMedia {
  type: string;        // Tipo del archivo ("image" o "video")
  url: string;         // URL del archivo
  public_id?: string;  // ID del archivo en Cloudinary (opcional)
}
interface ILike {
  userId: mongoose.Schema.Types.ObjectId;
  username: string;
}

interface IPost extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  date: Date;
  location: string;
  media: IMedia[];
  comments: IComment[];
  likes: ILike[];
  likeCount: number;
}

const postSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  location: { type: String, required: true },
  media: [
    {
      type: { type: String, enum: ["image", "video"], required: true },
      url: { type: String, required: true },
      public_id: { type: String },  // Campo opcional para el ID de Cloudinary
    },
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      username: { type: String, required: true },
    },
  ],
  likeCount: { type: Number, default: 0 },
});

const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;
