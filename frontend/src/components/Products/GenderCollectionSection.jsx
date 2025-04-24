import { Link } from "react-router-dom";
import shirtImg from "../../assets/ao1-collection.webp";
import pantsImg from "../../assets/quan1-collection.jpg";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Shirt Collection */}
        <div className="relative flex-1">
          <img
            src={shirtImg}
            alt="Shirt's Collection"
            className="w-full h-[700px] object-cover]"
          />
          <div className="absolute bottom-8 left-8 bg-blue-300 bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                ÁO NAM
            </h2>
            <Link to="/collections/all?category=Áo Nam" className="text-gray-900 underline">  {/* doi gender thanh type */}
                Xem Ngay
            </Link>
          </div>
        </div>
        {/* Pants Collection */}
        <div className="relative flex-1">
          <img
            src={pantsImg}
            alt="Pants's Collection"
            className="w-full h-[700px] object-cover]"
          />
          <div className="absolute bottom-8 left-8 bg-blue-300 bg-opacity-90 p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                QUẦN NAM
            </h2>
            <Link to="/collections/all?category=Quần Nam" className="text-gray-900 underline"> {/* doi gender thanh type */}
                Xem Ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
