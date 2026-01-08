import { ProductModel } from "../models/product.model.js";

export default class ProductManager {
  getProducts = (filter, options) => {
    return ProductModel.paginate(filter, options);
  };

  getProductById = (id) => {
    return ProductModel.findById(id);
  };
}
