import { Router } from "express";
import { CartModel } from "../dao/models/cart.model.js";

const router = Router();

// obtener carrito con populate
router.get("/:cid", async (req, res) => {
  const cart = await CartModel.findById(req.params.cid)
    .populate("products.product")
    .lean();

  res.json(cart);
});

// eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  await CartModel.findByIdAndUpdate(req.params.cid, {
    $pull: { products: { product: req.params.pid } }
  });
  res.json({ status: "success" });
});

// actualizar todo el carrito
router.put("/:cid", async (req, res) => {
  await CartModel.findByIdAndUpdate(req.params.cid, {
    products: req.body.products
  });
  res.json({ status: "success" });
});

// actualizar solo cantidad
router.put("/:cid/products/:pid", async (req, res) => {
  await CartModel.updateOne(
    { _id: req.params.cid, "products.product": req.params.pid },
    { $set: { "products.$.quantity": req.body.quantity } }
  );
  res.json({ status: "success" });
});

// vaciar carrito
router.delete("/:cid", async (req, res) => {
  await CartModel.findByIdAndUpdate(req.params.cid, { products: [] });
  res.json({ status: "success" });
});

// agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await CartModel.findById(cid);

    const productIndex = cart.products.findIndex(
      p => p.product.toString() === pid
    );

    if (productIndex === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }

    await cart.save();

    res.json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
});


export default router;
