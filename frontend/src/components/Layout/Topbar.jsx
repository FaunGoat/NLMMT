import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const Topbar = () => {
  return (
    <div className="bg-[#14b8b8] text-black">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">
            <FaFacebook className="h-8 w-8" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaInstagram className="h-8 w-7" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaTiktok className="h-7 w-7" />
          </a>
        </div>
        <div className="text-xl text-center flex-grow">
          <span>Chúng tôi mang đến cho bạn những trải nghiệm tuyệt vời nhất về thời trang!</span>
        </div>
        <div className="text-xl hidden md:block">
        <a href="tel:+84123456789" className="hover:text-gray-300">
            +84 123456789
          </a>
        </div>
      </div>
    </div>
  );
};
export default Topbar;
