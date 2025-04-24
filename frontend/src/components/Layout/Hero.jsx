import heroImg from "../../assets/slide-trang-chu.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative flex justify-center">
      <img
        src={heroImg}
        alt="Shaddock"
        className="w-11/12 h-auto object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <Link
            to="/collections/all"
            className="bg-lime-200 text-gray-950 px-6 py-2 rounded-sm text-xl md:text-6xl font-bold tracking-tighter uppercase mb-4"
          >
            Khám Phá Ngay
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
