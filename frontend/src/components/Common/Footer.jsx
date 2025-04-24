import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-[#14b8b8] text-black">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div>
          <h3 className="text-lg mb-4">Bản Tin</h3>
          <p className="mb-4">
            Hãy trở thành người đầu tiên nhận thông báo về các sản phẩm mới, các
            sự kiện độc quyền và ưu đãi trực tuyến.
          </p>
          <p className="font-medium text-sm mb-6">
            Đăng ký và nhận ngay mã giảm 10% cho đơn hàng đầu tiên.
          </p>

          {/* Newsletter form */}
          <form className="flex">
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              required
            />
            <button
              type="submit"
              className="whitespace-nowrap py-3 px-4 bg-black text-white text-sm rounded-r-md hover:bg-gray-800 transition-all"
            >
              Đăng Ký
            </button>
          </form>
        </div>

        {/* Shop links */}
        <div>
          <h3 className="text-lg mb-4">Danh Mục Sản Phẩm</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Áo Nam
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Quần Nam
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Áo Khoác
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Phụ Kiện
              </Link>
            </li>
          </ul>
        </div>
        {/* Support links */}
        <div>
          <h3 className="text-lg mb-4">Hỗ Trợ</h3>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Liên Hệ Chúng Tôi
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Chính Sách Bảo Mật
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Chính Sách Bảo Hành & Đổi Trả
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Chính Sách Vận Chuyển
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-red-600 transition-colors">
                Câu Hỏi Thường Gặp
              </Link>
            </li>
          </ul>
        </div>
        {/* Follow us */}
        <div>
          <h3 className="text-lg mb-4">Follow Shaddock.</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com/loi.nguyenminh.6595"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaFacebook className="h-8 w-8" />
            </a>
            <a
              href="https://www.instagram.com/lowji.ng_17"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaInstagram className="h-8 w-8" />
            </a>
            <a
              href="https://www.tiktok.com/@dytpf2r1n9no"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <FaTiktok className="h-7 w-7" />
            </a>
          </div>
          <p className="text-gray-800">
            <FiPhoneCall className="inline-block mr-2" />
            Hotline: 0123 456 789
          </p>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-sm tracking-tighter text-center">
          © 2025, CompileTab. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
