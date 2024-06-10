import axiosClient from "../axios-client.js";

export const getEntityById = async (endpoint, id) => {
  try {
    const response = await axiosClient.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "An error occurred" };
  }
};

export const updateEntity = async (endpoint, id, data) => {
  try {
    await axiosClient.put(`${endpoint}/${id}`, data);
  } catch (error) {
    throw error.response ? error.response.data : { message: "An error occurred" };
  }
};

export const createEntity = async (endpoint, data) => {
  try {
    await axiosClient.post(endpoint, data);
  } catch (error) {
    throw error.response ? error.response.data : { message: "An error occurred" };
  }
};
