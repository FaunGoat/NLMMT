const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }
  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });
    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error create checkout session", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc Update checkout payment status
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  console.log("PUT /api/checkout/:id/pay called");
  console.log("Checkout ID:", req.params.id);
  console.log("Request body:", req.body);

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      console.log("Checkout not found for ID:", req.params.id);
      return res.status(404).json({ message: "Checkout not found" });
    }

    console.log("Checkout found:", checkout);

    // Kiểm tra trạng thái thanh toán hợp lệ
    if (!["paid", "pending"].includes(paymentStatus)) {
      console.log("Invalid payment status:", paymentStatus);
      return res.status(400).json({ message: "Invalid Payment Status" });
    }

    // Cập nhật trạng thái thanh toán
    checkout.paymentStatus = paymentStatus;
    checkout.paymentDetails = paymentDetails;

    if (paymentStatus === "paid") {
      // VNPay: Đánh dấu đã thanh toán
      checkout.isPaid = true;
      checkout.paidAt = Date.now();
    } else if (paymentStatus === "pending") {
      // COD: Chưa thanh toán, chỉ lưu trạng thái pending
      checkout.isPaid = false;
      checkout.paidAt = null;
    }

    await checkout.save();

    console.log("Checkout updated successfully:", checkout);
    res.status(200).json(checkout);
  } catch (error) {
    console.error("Error updating checkout:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    // Kiểm tra điều kiện để hoàn tất
    if (checkout.paymentMethod === "VNPay" && !checkout.isPaid) {
      return res.status(400).json({ message: "Checkout is not paid" });
    }

    // Tạo Order dựa trên Checkout
    const finalOrder = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: checkout.isPaid, // true cho VNPay, false cho COD
      paidAt: checkout.paidAt, // Có giá trị cho VNPay, null cho COD
      isDelivered: false,
      paymentStatus: checkout.paymentStatus, // "paid" cho VNPay, "pending" cho COD
      paymentDetails: checkout.paymentDetails,
    });

    // Đánh dấu Checkout là đã hoàn tất
    checkout.isFinalized = true;
    checkout.FinalizedAt = Date.now();
    await checkout.save();

    // Xóa giỏ hàng của người dùng
    await Cart.findOneAndDelete({ user: checkout.user });

    res.status(201).json(finalOrder);
  } catch (error) {
    console.error("Error finalizing checkout:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/checkout/:id
// @desc Get checkout by ID
// @access Private
router.get("/:id", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    res.json(checkout);
  } catch (error) {
    console.error("Error fetching checkout:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/checkout/:id
// @desc Update checkout details (e.g., paymentMethod)
// @access Private
router.put("/:id", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (req.body.paymentMethod) {
      checkout.paymentMethod = req.body.paymentMethod;
    }
    // Có thể thêm các trường khác nếu cần

    await checkout.save();
    res.json(checkout);
  } catch (error) {
    console.error("Error updating checkout:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
