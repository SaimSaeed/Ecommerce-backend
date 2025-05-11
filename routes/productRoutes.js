import express from "express"
import { createProduct, createProductReview, deleteProduct, getProducts,getSingleProduct, getTopProducts, updateProduct } from "../controllers/productController.js"
import {protect,admin} from "../middleware/authMiddleware.js"
const router = express.Router()


router.route("/").get(getProducts).post(protect,admin,createProduct)
router.route("/top").get(getTopProducts)
router.route("/:id").get(getSingleProduct).put(protect,admin,updateProduct).delete(protect,admin,deleteProduct)
router.route("/:id/reviews").post(protect,createProductReview)






export default router