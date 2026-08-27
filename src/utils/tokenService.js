let _accessToken = "";

export const setAccessToken = (token) => {
  _accessToken = token || "";
  if (token) {
    localStorage.setItem("fithub_access_token", token);
  } else {
    localStorage.removeItem("fithub_access_token");
  }
};

export const getAccessToken = () => {
  if (!_accessToken) {
    _accessToken = localStorage.getItem("fithub_access_token") || "";
  }
  return _accessToken;
};

export const clearAccessToken = () => {
  _accessToken = "";
  localStorage.removeItem("fithub_access_token");
};
