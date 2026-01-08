import { Router } from "express";
import { ProductModel } from "../dao/models/product.model.js";
import { CartModel } from "../dao/models/cart.model.js";

const router = Router();

// HOME
router.get("/", (req, res) => {
  res.render("home", { cartId: "696013c84255911a1b2b51cd" });
});

// ABOUT
router.get("/about", (req, res) => {
  res.render("about", { cartId: "696013c84255911a1b2b51cd" });
});

// PRODUCTS
router.get("/products", async (req, res) => {
  try {
    const query = req.query.query;
    const page = Number(req.query.page) || 1;

    const filter = query ? { category: query } : {};

    const result = await ProductModel.paginate(filter, {
      limit: 10,
      page,
      lean: true
    });

    res.render("index", {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/products?page=${result.prevPage}&query=${query || ""}`
        : null,
      nextLink: result.hasNextPage
        ? `/products?page=${result.nextPage}&query=${query || ""}`
        : null,
      cartId: "696013c84255911a1b2b51cd"
    });
  } catch (error) {
    res.send("Error cargando productos");
  }
});

// CART
router.get("/carts/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate("products.product")
    .lean();

  res.render("cart", {
    cart,
    cartId: req.params.cid
  });
});

export default router;
