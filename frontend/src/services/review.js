import api from './api';

export async function submitReview(code) {
  const res = await api.post('/review/', { code });
  return res.data;
}
