const httpStatus = require("http-status");
const { Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  let cart = await Cart.findOne({ email: user.email });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  return cart;
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {
  let cart = await Cart.findOne({ email: user.email });

  if (!cart) {
    try {
      cart = await Cart.create({
        email: user.email,
        cartItems: [],
        paymentOption: config.default_payment_option,
      });
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "User cart creation failed because user already have a cart"
      );
    }
  }

  if (cart == null) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "User does not have a cart"
    );
  }

  // Find the index of the cart item matching the input productId, if any.
  let productIndex = -1;
  for (let i = 0; i < cart.cartItems.length; i++) {
    if (productId == cart.cartItems[i].product._id) {
      productIndex = i;
    }
  }

  // If product not in cart, add to cart. Otherwise, throw error.
  if (productIndex == -1) {
    let product = await Product.findOne({ _id: productId });

    if (product == null) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Product doesn't exist in database"
      );
    }

    cart.cartItems.push({ product: product, quantity: quantity });
  
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product already in cart. Use the cart sidebar to update or remove product from cart"
    );
  }

  await cart.save();
  return cart;

};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
  const cart = await Cart.findOne({email:user.email});
  if(cart === null){
    throw new ApiError(
      httpStatus.BAD_REQUEST, 
      "User does not have a cart. Use POST to create cart and add a product"
    );
  }
   
  let product = await Product.findOne({ _id: productId});
  if(product === null){
    throw new ApiError(
      httpStatus.BAD_REQUEST, 
      "Product doesn't exist in database"
    );
  }
  
  let productIndex = -1;
  for(let i = 0; i < cart.cartItems.length; i++){
    if(productId == cart.cartItems[i].product._id){
      productIndex = i;
      cart.cartItems[i].quantity = quantity;
      await cart.save();
    }
  }

  if(productIndex == -1){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart"); 
  }
  return cart;
};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  const cart = await Cart.findOne({email:user.email});
  if(cart === null){
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }
  
  let productIndex = -1;
  for(let i = 0; i < cart.cartItems.length; i++){
    if(productId == cart.cartItems[i].product._id){
      productIndex = i;
      cart.cartItems.splice(i,1);
      // let itemIndex = cart.cartItems[i]._id;
      // cart.cartItems.pull(itemIndex);
    }
  }
  if(productIndex === -1){
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  
  await cart.save();
};


// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 * 
 * - Get user's cart object using "Cart" model's findOne() method
 * 
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart."
 * 
 * - If cart.cartItems length == 0, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User's cart doesn't have any product."
 * 
 * - If user's address not set, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Address is not set."
 * 
 * - If user's walletMoney is insufficient, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User's wallet balance is insufficient."
 *
 * - Otherwise, update user wallet balance and return empty the cart on success
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
const checkout = async (user) => {
  const cart = await Cart.findOne({email: user.email});
  if(!cart){
    throw new ApiError(httpStatus.NOT_FOUND,"User does not have a cart");
  }

  if(cart.cartItems.length == 0){
    throw new ApiError(httpStatus.BAD_REQUEST,"User's cart doesn't have any product.");
  }
  const address = await user.hasSetNonDefaultAddress(user.address);
  if(!address){
    throw new ApiError(httpStatus.BAD_REQUEST,"Address is not set.");
  }

  let total = 0;
  cart.cartItems.forEach(item => {
    let qty = item.quantity;
    let cost = item.product.cost;
    total += qty*cost; 
  });
  if(user.walletMoney < total){
    throw new ApiError(httpStatus.BAD_REQUEST, "User's wallet balance is insufficient.");
  }
  user.walletMoney = user.walletMoney - total;
  cart.cartItems = [];
  await cart.save();
  return cart;
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
