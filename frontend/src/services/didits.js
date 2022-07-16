import axios from "axios";
const baseUrl = "/api/didits";

const getDidits = async (diditTitle, diditDateStart, diditDateEnd) => {
  const config = {
    params: {
      title: diditTitle,
      dateA: diditDateStart,
      dateB: diditDateEnd,
    },
  };
  const response = await axios.get(baseUrl, config);
  return response.data;
};
const getArchivedProject = async (id) => {
  const config = {
    params: {
      project: id,
    },
  };
  const response = await axios.get(baseUrl, config);
  return response.data;
};
const createDidits = async (didit, user) => {
  const config = {
    headers: { Authorization: `bearer ${user.token}` },
  };
  const response = await axios.post(baseUrl, didit, config);
  return response.data;
};

export default { getDidits, createDidits, getArchivedProject };
