import axios from "./customize-axios";

const fetchDataUsers = () => {
  return axios.get("/users");
};

const fetchDataAlbums = () => {
  return axios.get("/albums");
};

const fetchDataAlbumByUserId = (userId) => {
  return axios.get(`albums?userId=${userId}`);
};
const fetchDataAlbumById = (id) => {
  return axios.get(`albums/${id}`);
};

export {
  fetchDataUsers,
  fetchDataAlbums,
  fetchDataAlbumByUserId,
  fetchDataAlbumById,
};
