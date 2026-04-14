import client from './client';

export const likePost = (postId, username) =>
  client.post(`/posts/${postId}/likes`, { username }).then((r) => r.data);

export const unlikePost = (postId) =>
  client.delete(`/posts/${postId}/likes`);
