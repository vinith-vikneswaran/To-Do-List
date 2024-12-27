export default {
  server: {
    proxy: {
      '/todos': 'http://localhost:8000',  // Forward /todos requests to backend
    },
  },
};
