import api from './axios';
import { Post } from '@components/post/types';
import { UserAuth } from '@components/auth/types';
import { BaseUser } from '@components/user';

// Interfaces para las respuestas del backend
interface UploadMediaResponse {
  url: string;
  type: 'image' | 'video';
}

export interface BaseBackendPost {
  _id: string;
  user: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  title: string;
  date: string;
  location: string;
  media: Array<{
    type: string;
    url: string;
    _id: string;
  }>;
  comments: any[];
  likes: string[];
  likeCount: number;
 }
 
 export interface CreatePostResponse {
  message: string;
  post: BaseBackendPost;
 }

interface CreatePostParams {
  mediaUri: string;
  mediaType: 'image' | 'video';
  caption: string;
  location: string;
}

const transformUser = (userAuth: UserAuth): BaseUser => ({
  id: userAuth.id,
  username: userAuth.username,
  profilePicture: userAuth.profilePicture || null
});

const uploadMedia = async (mediaUri: string): Promise<UploadMediaResponse> => {
  try {
    const formData = new FormData();
    const fileName = mediaUri.split('/').pop() || 'upload.jpg';
    const file = {
      uri: mediaUri,
      name: fileName,
      type: `image/${fileName.split('.').pop()}`
    };
    
    formData.append('media', file as any);

    const response = await api.post<UploadMediaResponse>(
      '/posts/upload', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log('Full error:', error);
    console.error('Error uploading media:', error);
    throw error;
  }
};

const createPost = async (postData: {
  title: string;
  location: string;
  media: Array<{
    type: string;
    url: string;
  }>;
}): Promise<CreatePostResponse> => {
  try {
    const response = await api.post<CreatePostResponse>(
      '/posts', // Nota: removido el slash inicial
      postData
    );

    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const createPostWithMedia = async (
  params: CreatePostParams,
  userAuth: UserAuth
): Promise<Post> => {
  try {
    // 1. Primero subimos el media y obtenemos la URL de Cloudinary
    const uploadResponse = await uploadMedia(params.mediaUri);
    console.log('Upload Response:', uploadResponse);

    // 2. Creamos el post con la URL de Cloudinary
    const postResponse = await createPost({
      title: params.caption, // El frontend usa caption, el backend usa title
      location: params.location,
      media: [{
        type: uploadResponse.type,
        url: uploadResponse.url
      }]
    });
    console.log('Post Response:', postResponse);

    // 3. Transformamos la respuesta al formato que espera el frontend
    return {
      id: postResponse.post._id,
      user: transformUser(userAuth),
      imageUrl: postResponse.post.media[0].url,
      location: postResponse.post.location,
      description: postResponse.post.title,
      likesCount: postResponse.post.likeCount,
      isLiked: false,
      isSaved: false,
      createdAt: postResponse.post.date,
      commentsCount: 0,
      comments: [],
      mediaType: uploadResponse.type
    };
  } catch (error) {
    console.error('Error in createPostWithMedia:', error);
    throw error;
  }
};