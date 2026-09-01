import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

// Lấy danh sách sản phẩm
export const getProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Thêm sản phẩm mới
export const createProduct = async (productData) => {
    const response = await axios.post(API_URL, productData);
    return response.data;
};

// Xóa sản phẩm
export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
//
// Cập nhật sản phẩm
export const updateProduct = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
};