import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from "react-icons/hi2";

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiShoppingBag className="text-xl" />
          </div>
          <h4 className="tracking-tighter mb-2">
            MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC
          </h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            Cho các đơn hàng trên 50K
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiArrowPathRoundedSquare className="text-xl" />
          </div>
          <h4 className="tracking-tighter mb-2">
            ĐỔI-TRẢ TRONG VÒNG 15 NGÀY
          </h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            Tính từ ngày mua hàng (Theo hóa đơn)
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiOutlineCreditCard className="text-xl" />
          </div>
          <h4 className="tracking-tighter mb-2">
            THANH TOÁN AN TOÀN
          </h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            Đảm bảo quy trình thanh toán an toàn 100%
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
