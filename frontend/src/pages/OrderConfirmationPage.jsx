import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      // Nếu có checkoutId, xóa giỏ hàng và lưu thông tin đơn hàng vào localStorage
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      // Nếu không có checkoutId, điều hướng về trang đơn hàng của người dùng
      console.log("No orderId found, redirecting to /my-orders");
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 3);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Cảm Ơn Bạn Đã Đặt Hàng
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* Order ID and Date */}
            <div>
              <h2 className="text-xl font-semibold">
                Mã Đơn Hàng: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Ngày Đặt Hàng:{" "}
                {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm">
                Ngày Giao Hàng Dự Kiến:{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* Ordered Items */}
          <div className="mb-12">
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-base font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    Màu sắc: {item.color} | Size: {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-base">{item.price?.toLocaleString()}₫</p>
                  <p className="text-sm text-gray-500">
                    Số Lượng: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center text-xl font-semibold mt-6 border-t pt-4">
              <p>Tổng Tiền</p>
              <p>{checkout.totalPrice?.toLocaleString()} ₫</p>
            </div>
          </div>
          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            {/* Payment Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Thanh Toán</h4>
              <p className="text-gray-600">
                Phương thức: {checkout.paymentMethod || "N/A"}
              </p>
              {checkout.paymentDetails && (
                <>
                  <p className="text-gray-600">
                    Mã Giao Dịch:{" "}
                    {checkout.paymentDetails.transactionId || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Thời Gian Thanh Toán:{" "}
                    {checkout.paidAt
                      ? new Date(checkout.paidAt).toLocaleString()
                      : "N/A"}
                  </p>
                  {/* <p className="text-gray-600">
                    Trạng Thái: {checkout.paymentStatus || "N/A"}
                  </p> */}
                  {checkout.paymentDetails.vnpayOrderId && (
                    <p className="text-gray-600">
                      VNPay Order ID: {checkout.paymentDetails.vnpayOrderId}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Delivery Info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Vận Chuyển</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
