import Api from "../constants/Api";

const CANT_CONNECT_INTERNET = "Can't connect internet";

function fetchWithTimeOut(promise, ms = 25000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(CANT_CONNECT_INTERNET));
    }, ms);
    promise.then(resolve, reject);
  });
}

const CommonCall = async (api, header) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    let headers;
    if (accessToken) {
      headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      };
    } else {
      headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      };
    }
    if (
      header &&
      (header.method === "POST" ||
        header.method === "PUT" ||
        header.method === "GET")
    ) {
      headers = {
        ...headers,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      };
    }
    let head = {
      ...header,
      headers,
    };

    const response = await fetchWithTimeOut(
      fetch(api, {
        ...head,
        credentials: "omit",
      })
    );

    if (response.status === 500) {
      return {
        code: response.status,
        message: "Server error",
        success: false,
      };
    }

    if (response.status === 200) {
      return await response.json();
    }
    if (response.status === 201) {
      return await response.json();
    }

    if (response.status === 401) {
      return await response.json();
    }

    // if (response.status === 401) {
    //   //refresh token
    //   const resToken = await refreshToken();

    //   if (resToken.success) {
    //     const newHeaders = {
    //       ...headers,
    //       Authorization: `Bearer ${resToken.access_token}`,
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //       "Access-Control-Request-Headers": "*",
    //     };
    //     const newHead = {
    //       ...head,
    //       headers: newHeaders,
    //     };
    //     const responseRefeshToken = await fetch(api, newHead);
    //     const resultRefeshToken = await responseRefeshToken.json();
    //     return resultRefeshToken;
    //   }
    //   if (response.status === 401) {
    //     window.location.href = "/login";
    //   } else {
    //     return {
    //       code: response.code,
    //       success: false,
    //     };
    //   }
    // } else {
    //   const resJson = await response.json();
    //   return {
    //     code: resJson.status,
    //     message: resJson.message,
    //     success: false,
    //   };
    // }
  } catch (error) {
    return {
      success: false,
      message: "Network error",
    };
  }
};

const FetchApi = {
  login: async (data) => {
    const body = {
      email: data.email,
      password: data.password,
    };
    const header = {
      method: "POST",
      body: JSON.stringify(body),
    };
    const api = Api.login;
    const result = await CommonCall(api, header);
    return result;
  },
  register: async (data) => {
    const header = {
      method: "POST",
      body: JSON.stringify(data),
    };
    const api = Api.register;
    const result = await CommonCall(api, header);
    return result;
  },
  resetPasswordRequest: async (data) => {
    const header = {
      method: "POST",
      body: JSON.stringify(data),
    };
    const api = Api.resetPasswordRequest;
    const result = await CommonCall(api, header);
    return result;
  },
  resetPasswordConfirm: async (data) => {
    const header = {
      method: "POST",
      body: JSON.stringify(data),
    };
    const api = Api.resetPasswordConfirm;
    const result = await CommonCall(api, header);
    return result;
  },
  resetPassword: async (data) => {
    const header = {
      method: "POST",
      body: JSON.stringify(data),
    };
    const api = Api.resetPassword;
    const result = await CommonCall(api, header);
    return result;
  },
  changePassword: async (data) => {
    const header = {
      method: "POST",
      body: JSON.stringify(data),
    };
    const api = Api.changePassword;
    const result = await CommonCall(api, header);
    return result;
  },
  getAnalysis: async (data) => {
    const header = {
      method: "POST",
      body: JSON.stringify(data),
    };
    const api = Api.getAnalysis;
    const result = await CommonCall(api, header);
    return result;
  },
  updateUserProfile: async (data) => {
    const header = {
      method: "POST",
      body: JSON.stringify(data),
    };
    const api = Api.updateUserProfile;
    const result = await CommonCall(api, header);
    return result;
  },
  getUserProfile: async (id) => {
    const api = Api.getUserProfile(id);

    const result = await CommonCall(api);
    return result;
  },

  getUser: async (id) => {
    const api = Api.getUser(id);
    const result = await CommonCall(api);
    return result;
  },
  getProducts: async (store_name, page) => {
    const api = Api.getProducts(store_name, page);
    const result = await CommonCall(api);
    return result;
  },
  deleteProducts: async (product_ids) => {
    const header = {
      method: "POST",
      body: JSON.stringify(product_ids),
    };
    const api = Api.deleteProducts;
    const result = await CommonCall(api, header);
    return result;
  },
  getProduct: async (product_id) => {
    const api = Api.getProduct(product_id);
    const result = await CommonCall(api);
    return result;
  },
  createProduct: async (dataCreate) => {
    const header = {
      method: "POST",
      body: JSON.stringify(dataCreate),
    };
    const api = Api.createProduct;
    const result = await CommonCall(api, header);
    return result;
  },
  editProduct: async (dataCreate, product_id) => {
    const header = {
      method: "POST",
      body: JSON.stringify(dataCreate),
    };
    const api = Api.editProduct(product_id);
    const result = await CommonCall(api, header);
    return result;
  },
  getProductsByStore: async (store_name, page) => {
    const api = Api.getProductsByStore(store_name, page);
    const result = await CommonCall(api);
    return result;
  },
};
export { FetchApi, CommonCall };
