import { Router } from "express";
import { products } from "../utils/test-data.mjs";

const productRouter = Router();

productRouter.get("/api/products", (req, res) => {
  if (
    req.signedCookies.cookieName &&
    req.signedCookies.cookieName === "HelloWorld"
  ) {
    return res.send(products);
  }
  return res.status(403).send({ msg: "Not correct cookie" });
});

export default productRouter;
