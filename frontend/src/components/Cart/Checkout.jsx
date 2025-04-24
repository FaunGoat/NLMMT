import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";
import VNPayButton from "./VNPayButton";

// Hàm tạo orderId duy nhất cho VNPay
const generateUniqueOrderId = (checkoutId) => {
  const timestamp = Date.now();
  return `${checkoutId}-${timestamp}`; // Kết hợp checkoutId với timestamp để đảm bảo tính duy nhất
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [vnpayOrderId, setVnpayOrderId] = useState(null);
  const hasProcessed = useRef(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // null: chưa chọn, "VNPay" hoặc "COD"
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Xử lý callback từ VNPay
  useEffect(() => {
    console.log("useEffect running with location:", location.search);
    const queryParams = new URLSearchParams(location.search);
    const vnpResponseCode = queryParams.get("vnp_ResponseCode");
    const vnpTransactionNo = queryParams.get("vnp_TransactionNo");
    const checkoutIdFromQuery = queryParams.get("checkoutId");

    if (
      vnpResponseCode === "00" &&
      checkoutIdFromQuery &&
      !hasProcessed.current
    ) {
      hasProcessed.current = true;
      const paymentDetails = {
        transactionId: vnpTransactionNo,
        vnpayOrderId: vnpayOrderId,
      };
      console.log("Payment success");
      handlePaymentSuccess(paymentDetails, checkoutIdFromQuery);
    } else if (
      vnpResponseCode &&
      vnpResponseCode !== "00" &&
      !hasProcessed.current
    ) {
      handlePaymentError(new Error("Thanh toán thất bại từ VNPay"));
      hasProcessed.current = true;
    }
  }, [location]); // Loại bỏ hasProcessedPayment khỏi dependency

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0 && !checkoutId) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: paymentMethod,
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
        setVnpayOrderId(generateUniqueOrderId(res.payload._id));
      }
    }
  };

  const handlePaymentSuccess = async (details, checkoutId) => {
    console.log("handlePaymentSuccess called with checkoutId:", checkoutId);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      dispatch(createCheckout.fulfilled(response.data));
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Cập nhật trạng thái thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    console.log("Starting handleFinalizeCheckout with checkoutId:", checkoutId);

    try {
      // Lấy thông tin Checkout trước
      const checkResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("Checkout status:", checkResponse.data);

      // Nếu đã finalize, chuyển hướng ngay
      if (checkResponse.data.isFinalized) {
        console.log("Checkout already finalized, navigating...");
        navigate("/order-confirmation");
        return;
      }

      // Kiểm tra trạng thái thanh toán dựa trên paymentMethod
      const { paymentMethod, isPaid } = checkResponse.data;
      if (paymentMethod === "VNPay" && !isPaid) {
        console.error("VNPay checkout not paid yet");
        alert(
          "Đơn hàng VNPay chưa được thanh toán. Vui lòng hoàn tất thanh toán trước."
        );
        return;
      }

      // Gọi API finalize
      console.log("Calling finalize API...");
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("Finalize API response:", response.data);

      // Lấy orderId từ response (nếu backend trả về)
      const orderId = response.data._id || checkoutId; // Dùng checkoutId làm fallback nếu không có orderId
      navigate("/order-confirmation");
    } catch (error) {
      console.error(
        "Error finalizing checkout:",
        error.response?.data || error.message
      );
      if (
        error.response?.status === 400 &&
        error.response?.data?.message === "Checkout already finalized"
      ) {
        console.log("Checkout already finalized (from error), navigating...");
        navigate("/order-confirmation");
      } else if (error.response?.status === 404) {
        alert("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại.");
      } else if (error.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        alert(
          `Hoàn tất đơn hàng thất bại: ${
            error.response?.data?.message || "Lỗi không xác định"
          }. Vui lòng thử lại.`
        );
      }
    }
  };

  const handleCODCheckout = async () => {
    console.log("handleCODCheckout called with checkoutId:", checkoutId);
    if (!checkoutId) {
      alert("Vui lòng tạo đơn hàng trước khi hoàn tất.");
      return;
    }
    try {
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error("Error processing COD checkout:", error);
      alert("Hoàn tất đơn hàng thất bại. Vui lòng thử lại.");
    }
  };

  const handlePaymentError = (error) => {
    if (error.message.includes("Giao dịch trùng lặp")) {
      setVnpayOrderId(generateUniqueOrderId(checkoutId));
      alert("Giao dịch trùng lặp. Đang thử lại với ID mới...");
    } else {
      alert("Thanh Toán Thất Bại. Thử Lại.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Giỏ hàng của bạn trống.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Thanh Toán</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Thông Tin Liên Hệ</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Vận Chuyển</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Họ</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Tên</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Địa Chỉ</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Tỉnh/Thành Phố</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Mã Bưu Chính</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quốc Gia</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Số Điện Thoại</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  onClick={() => setPaymentMethod("VNPay")}
                  className="w-full bg-blue-500 text-white py-3 rounded"
                >
                  Thanh Toán Qua VNPay
                </button>
                <button
                  type="submit"
                  onClick={() => setPaymentMethod("COD")}
                  className="w-full bg-green-500 text-white py-3 rounded"
                >
                  Thanh Toán Khi Nhận Hàng
                </button>
              </div>
            ) : paymentMethod === "VNPay" ? (
              <div>
                <VNPayButton
                  amount={cart.totalPrice}
                  orderId={vnpayOrderId}
                  checkoutId={checkoutId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutId(null);
                    setPaymentMethod(null);
                    setVnpayOrderId(null);
                  }}
                  className="w-full bg-gray-500 text-white py-3 rounded mt-4"
                >
                  Chọn Phương Thức Khác
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleCODCheckout}
                  className="w-full bg-blue-500 text-white py-3 rounded"
                >
                  Hoàn Tất Đơn Hàng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutId(null);
                    setPaymentMethod(null);
                    setVnpayOrderId(null);
                  }}
                  className="w-full bg-gray-500 text-white py-3 rounded mt-4"
                >
                  Chọn Phương Thức Khác
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Tóm Tắt Đơn Hàng</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-base">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Màu Sắc: {product.color}</p>
                </div>
              </div>
              <p className="text-lg">
                {product.price ? Number(product.price).toLocaleString() : "N/A"}{" "}
                ₫
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Tổng Tiền Hàng</p>
          <p>{cart.totalPrice?.toLocaleString()} ₫</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Phí Vận Chuyển</p>
          <p>Miễn Phí</p>
        </div>
        <div className="flex justify-between items-center text-lg mb-4 border-t pt-4">
          <p>Thành Tiền</p>
          <p>{cart.totalPrice?.toLocaleString()} ₫</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
