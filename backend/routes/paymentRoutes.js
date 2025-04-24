const express = require("express");
const router = express.Router();
const crypto = require("crypto"); // Thêm import crypto

// Cấu hình VNPay
const vnpayConfig = {
  vnp_TmnCode: "JW31DX73",
  vnp_HashSecret: "UZRI6558MEM23T3P22IR35U1NX39O0WV",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl: "http://localhost:5173/checkout",
};

// Hàm tạo URL thanh toán
function createPaymentUrl({ amount, orderId, orderInfo, ipAddr, checkoutId }) {
  console.log("Starting createPaymentUrl with params:", {
    amount,
    orderId,
    orderInfo,
    ipAddr,
    checkoutId,
  });

  // Kiểm tra amount
  if (typeof amount !== "number" || amount <= 0 || !Number.isInteger(amount)) {
    throw new Error("Amount phải là số nguyên dương");
  }

  // Kiểm tra checkoutId
  if (!checkoutId) {
    throw new Error("checkoutId không được để trống");
  }

  let vnp_Params = {};

  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = vnpayConfig.vnp_TmnCode;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_CreateDate"] = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_IpAddr"] = ipAddr || "127.0.0.1";
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_OrderInfo"] = encodeURIComponent(orderInfo); // Encode orderInfo
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_ReturnUrl"] = `${
    vnpayConfig.vnp_ReturnUrl
  }?checkoutId=${encodeURIComponent(checkoutId)}`; // Encode checkoutId
  vnp_Params["vnp_TxnRef"] = orderId;

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  const queryString = new URLSearchParams(sortedParams).toString();
  const signData = queryString;
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const secureHash = hmac.update(signData).digest("hex");

  return `${vnpayConfig.vnp_Url}?${queryString}&vnp_SecureHash=${secureHash}`;
}

router.post("/create", (req, res) => {
  console.log("Received request at /api/payment/create:", req.body);
  const { amount, orderInfo, orderId, checkoutId } = req.body;

  // Kiểm tra các tham số bắt buộc
  if (!amount || !orderId || !checkoutId) {
    console.error("Missing required parameters:", {
      amount,
      orderId,
      checkoutId,
    });
    return res.status(400).json({
      success: false,
      message: "Thiếu tham số bắt buộc: amount, orderId, hoặc checkoutId",
    });
  }

  try {
    const encodedOrderInfo = encodeURIComponent(
      orderInfo || `Thanh toan don hang ${orderId}`
    );
    const paymentUrl = createPaymentUrl({
      amount,
      orderId,
      orderInfo: encodedOrderInfo,
      ipAddr: req.ip || "127.0.0.1",
      checkoutId, // Đảm bảo checkoutId được truyền vào
    });

    console.log("Generated payment URL:", paymentUrl);
    res.json({ success: true, paymentUrl });
  } catch (error) {
    console.error("Error creating payment URL:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Không thể tạo URL thanh toán",
      error: error.message,
    });
  }
});

// Xử lý callback từ VNPay
router.get("/vnpay-return", (req, res) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  // Xóa các tham số không cần thiết để kiểm tra hash
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  const queryString = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const calculatedHash = hmac.update(queryString).digest("hex");

  if (secureHash === calculatedHash) {
    const responseCode = vnp_Params["vnp_ResponseCode"];
    if (responseCode === "00") {
      res.json({
        success: true,
        message: "Thanh toán thành công",
        data: vnp_Params,
      });
    } else {
      res.json({
        success: false,
        message: "Thanh toán thất bại",
        data: vnp_Params,
      });
    }
  } else {
    res.json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      data: vnp_Params,
    });
  }
});

module.exports = router;
