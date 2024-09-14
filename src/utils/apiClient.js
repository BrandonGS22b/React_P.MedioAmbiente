 const apiClient = (token) => {
    return {
      get: (url) =>
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => response.json()),
      post: (url, body) =>
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then((response) => response.json()),
    };
  };
  export default apiClient;