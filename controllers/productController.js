import asyncHandler from "../middleware/asyncHandler.js"
import Product from "../model/Product.js"

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT
  const page = Number(req.query.pageNumber) || 1
  const keyword = req.query.keyword  ? {name:{$regex:req.query.keyword, $options:'i'}} : {}
  const count = await Product.countDocuments({...keyword})
  const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page-1))
  return res.json({products,page,pages:Math.ceil(count/pageSize)})
})


const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    return res.json(product)

  }
  else {
    res.status(404)
    throw new Error("Resource Not Found!")
  }
})


// Get Top Products
const getTopProducts = asyncHandler(async (req,res)=>{
  const topProducts = await Product.find({}).sort({rating:-1}).limit(3)
  if(topProducts){
    res.status(200).json(topProducts)
  }else{
    res.status(500)
    throw new Error("Resource Not Found!")
  }

})

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    imageSrc: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    reviewNum: 0,
    description: "Sample Description",
  })
  const createdProduct = await product.save()
  return res.status(201).json(createdProduct)
})

const updateProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.imageSrc = req.body.imageSrc;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;

    const updatedProduct = await product.save()
    return res.status(200).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error("Product Not Found!")
  }
})



const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.status(200).json({ message: "Product Deleted!" })
  } else {
    res.status(404)
    throw new Error("Product Not Found!")
  }

})


const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id)
  if (product) {
    // Finding the existing review  of the user
    const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString())
    // If already reviewed then send response
    if (alreadyReviewed) {
      res.status(400)
      throw new Error("Product Already Reviewed!")
    }
    // Setting the review object
    const review = {
      username: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id
    }
    // updating the reviews
    product.reviews.push(review)
    product.reviewNum = product.reviews.length
    // calculating the average rating
    product.rating = product.reviews.reduce((acc, review) => acc += review.rating, 0) / product.reviews.length
    // Saving the changes
    await product.save()
    res.status(200).json("Review Added!")
  } else {
    res.status(404)
    throw new Error("Resource Not Found!")
  }

})





export { getProducts, getSingleProduct, createProduct, updateProduct, deleteProduct ,createProductReview,getTopProducts}