const URL_API = import.meta.env.VITE_API_URL;

const Api = {
  login: URL_API + "auth/login",
  register: URL_API + "auth/register",
  resetPasswordRequest: URL_API + "auth/reset-password-request",
  resetPasswordConfirm: URL_API + "auth/reset-password-confirm",
  resetPassword: URL_API + "auth/reset-password",
  changePassword: URL_API + "auth/change-password",
  updateUserProfile: URL_API + "user-profiles",
  getAnalysis: URL_API + "products/analyze",
  getUserProfile: (id) => `${URL_API}user-profiles/${id}`,
  getUser: (id) => `${URL_API}auth/user/${id}`,
  getProducts: (store_name, page) =>
    `${URL_API}products?store_name=${store_name}&page=${page}`,
  getProduct: (product_id) => `${URL_API}products/${product_id}`,
  createProduct: URL_API + "products",
  editProduct: (product_id) => `${URL_API}products/${product_id}`,
  deleteProducts: URL_API + "products/delete",
  getProductsByStore: (store_name, page) =>
    `${URL_API}products/get-product-by-store?store_name=${store_name}&page=${page}`,
};

export default Api;
