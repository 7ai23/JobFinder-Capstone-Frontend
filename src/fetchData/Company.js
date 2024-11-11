import axios from "./axios";
const token = localStorage.getItem("token");
const getAllCompanies = (searchKey) => {
  return axios.get(`/getAllCompaniesInactive?searchKey=${searchKey}`,{
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};
const getAllCompaniesInHomePage = () => {
  return axios.get("/getAllCompanies");
}
const getAllCompaniesUser = (searchKey) => {
  return axios.get(`/getAllCompanies?searchKey=${searchKey}`,{
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};
const getCompanyById = (companyId) => {
  return axios.get(`/getCompanyById?id=${companyId}`,{
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};
const banCompany = (companyId) => {
  return axios.post(`/banCompany`, {
    companyId: companyId,
  },{
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};
const unbanCompany = (companyId) => {
  return axios.post(`/unBanCompany`, {
    companyId: companyId,
  },{
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};
const updateCompany = (
  companyId,
  name,
  address,
  description,
  phonenumber,
  amountEmployer,
  coverimage,
  thumbnail,
  file
) => {
  return axios.post(`/updateCompany`, {
    companyId: companyId,
    name: name,
    address: address,
    description: description,
    phonenumber: phonenumber,
    amountEmployer: amountEmployer,
    coverimage: coverimage,
    thumbnail: thumbnail,
    file: file,
  },{
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};

const inactiveCompany = (companyId) => {
  return axios.post(`/rejectCompany`, {
    companyId: companyId,
  },{
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};

const activeCompany = (companyId) => {
  return axios.post(`/approveCompany`, {
    companyId: companyId,
  },{
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};

const createNewCompany = (data) => {
  return axios.post(`/createNewCompany`, data,{
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
};

export {
  getAllCompanies,
  getCompanyById,
  banCompany,
  inactiveCompany,
  activeCompany,
  unbanCompany,
  getAllCompaniesUser,
  updateCompany,
  createNewCompany,
  getAllCompaniesInHomePage
};
