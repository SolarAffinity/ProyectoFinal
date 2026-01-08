import { CartModel } from "../models/cart.model.js";

export default class CartManager {
  getCartById = (cid) => {
    return CartModel.findById(cid).populate("products.product");
  };

  updateCart = (cid, products) => {
    return CartModel.findByIdAndUpdate(cid, { products });
  };
}
