import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    laoding: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    laoding: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Trang Quản Lý</h1>
      {productsLoading || ordersLoading ? (
        <p>Loading...</p>
      ) : productsError ? (
        <p className="text-red-500">
          Lỗi khi tìm nạp sản phẩm: {productsError}
        </p>
      ) : ordersError ? (
        <p className="text-red-500">Lỗi khi tìm nạp đơn hàng: {ordersError}</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Doanh Thu</h2>
            <p className="text-2xl">{totalSales?.toLocaleString()} ₫</p>
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Tổng Đơn Hàng</h2>
            <p className="text-2xl">{totalOrders}</p>
            <Link to="/admin/orders" className="text-blue-500 hover:underline">
              Quản Lý Đơn Hàng
            </Link>
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Tổng Sản Phẩm</h2>
            <p className="text-2xl">{products.length}</p>
            <Link
              to="/admin/products"
              className="text-blue-500 hover:underline"
            >
              Quản Lý Sản Phẩm
            </Link>
          </div>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Đơn Hàng Gần Đây</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Mã Đơn Hàng</th>
                <th className="py-3 px-4">Người Dùng</th>
                <th className="py-3 px-4">Thành Tiền</th>
                <th className="py-3 px-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user.name}</td>
                    <td className="p-4">
                      {order.totalPrice?.toLocaleString()} ₫
                    </td>
                    <td className="p-4">
                      {
                        {
                          Processing: "Đang Xử Lý",
                          Shipped: "Đang Vận Chuyển",
                          Delivered: "Đã Giao Hàng",
                          Cancelled: "Đã Hủy",
                        }[order.status] || "Trạng thái không xác định" // Giá trị mặc định nếu status không khớp
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Không tìm thấy đơn hàng gần đây.
                </td>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
