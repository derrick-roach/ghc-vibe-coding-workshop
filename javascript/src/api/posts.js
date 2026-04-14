import client from './client';

export const listPosts = () => client.get('/posts').then((r) => r.data);

export const createPost = (username, content) =>
  client.post('/posts', { username, content }).then((r) => r.data);

export const getPost = (postId) =>
  client.get(`/posts/${postId}`).then((r) => r.data);

export const deletePost = (postId) => client.delete(`/posts/${postId}`);
