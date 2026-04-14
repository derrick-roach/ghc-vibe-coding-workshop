import client from './client';

export const listComments = (postId) =>
  client.get(`/posts/${postId}/comments`).then((r) => r.data);

export const createComment = (postId, username, content) =>
  client
    .post(`/posts/${postId}/comments`, { username, content })
    .then((r) => r.data);
