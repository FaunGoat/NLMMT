const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    size: String,
    color: String,
    quantity: {
      type: Number,
      require: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      address: { type: String, require: true },
      city: { type: String, require: true },
      potalCode: { type: String, require: true },
      country: { type: String, require: true },
    },
    paymentMethod: {
      type: String,
      require: true,
    },
    totalPrice: {
      type: Number,
      require: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    DeliveredAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
