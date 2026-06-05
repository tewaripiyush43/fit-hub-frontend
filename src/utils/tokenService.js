let _accessToken = "";

export const setAccessToken = (token) => {
  _accessToken = token;
};

export const getAccessToken = () => {
  return _accessToken;
};

export const clearAccessToken = () => {
  _accessToken = "";
};
