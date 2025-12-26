// features/enquiry/enquiryService.js (correction)
import axios from "axios";
import { base_url } from "../../utils/axiosConfig";

const postQuery = async (enquiryData) => {
  const response = await axios.post(`${base_url}/enquiry`, enquiryData);
  if (response.data) {
    return response.data;
  }
};

export const enquiryService = {
  postQuery
};