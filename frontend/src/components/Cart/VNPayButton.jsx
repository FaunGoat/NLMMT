// src/components/VNPayButton.jsx
import { useState } from "react";

const VNPayButton = ({ amount, orderId, checkoutId, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = async () => {
    console.log("Sending to /api/payment/create:", {
      amount,
      orderId,
      checkoutId,
    });
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:9000/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          orderId,
          checkoutId, // Truyền checkoutId
          orderInfo: `Thanh toan don hang ${checkoutId}`,
        }),
      });

      const result = await response.json();
      if (result.success && result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.message || "Không thể tạo URL thanh toán");
      }
    } catch (error) {
      setIsLoading(false);
      onError(error);
    }
  };

  // Style giống PayPal
  const sizeStyles = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    outline:
      "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      onClick={createOrder}
      disabled={isLoading}
      className={`
        flex items-center justify-center
        w-full
        ${sizeStyles["md"]}
        ${variantStyles["primary"]}
        disabled:bg-gray-300
        disabled:cursor-not-allowed
        disabled:border-gray-300
        rounded-full
        font-semibold
        transition-all duration-200
        shadow-md
        ${isLoading ? "opacity-75 cursor-wait" : ""}
      `}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Đang xử lý...
        </span>
      ) : (
        <>
          <span className="flex items-center gap-2">
            <span className="font-bold">Tiếp tục thanh toán bằng VNPay</span>
          </span>
          {/* {amount && (
            <span className="ml-2">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(amount)}
            </span>
          )} */}
        </>
      )}
    </button>
  );
};

export default VNPayButton;
