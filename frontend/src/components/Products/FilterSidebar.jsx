import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    size: [],
    material: [],
    minPrice: 0,
    maxPrice: 1000000,
  });

  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const categories = ["Áo Nam", "Quần Nam", "Áo Khoác", "Phụ Kiện"];

  // Danh sách màu với tên tiếng Việt và giá trị CSS
  const colors = [
    { name: "Trắng", value: "white" },
    { name: "Đen", value: "black" },
    { name: "Đỏ", value: "red" },
    { name: "Xanh", value: "blue" },
    { name: "Be", value: "beige" },
    { name: "Xám", value: "gray" },
    { name: "Navy", value: "navy" },
    { name: "Camo", value: "#50654D" },
  ];

  const sizes = ["S", "M", "L", "XL", "2XL"];

  const materials = [
    "Cotton",
    "Lụa",
    "CVC Cá Sấu",
    "Da",
    "Denim",
    "Dù",
    "Polyester",
    "Nỉ",
    "Kaki",
  ];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    // Giải mã các giá trị từ URL để hỗ trợ tiếng Việt
    setFilters({
      category: params.category ? decodeURIComponent(params.category) : "",
      color: params.color ? decodeURIComponent(params.color) : "",
      size: params.size ? decodeURIComponent(params.size).split(",") : [],
      material: params.material
        ? decodeURIComponent(params.material).split(",")
        : [],
      minPrice: params.minPrice ? Number(params.minPrice) : 0,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : 1000000,
    });
    setPriceRange([0, params.maxPrice ? Number(params.maxPrice) : 1000000]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleColorChange = (colorValue) => {
    const newFilters = { ...filters, color: colorValue };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key] && newFilters[key] !== "0") {
        // Loại bỏ minPrice=0 mặc định
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = Number(e.target.value);
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Bộ Lọc</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Sản Phẩm</label>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              onChange={handleFilterChange}
              checked={filters.category === category}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Màu Sắc</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div key={color.value} className="flex flex-col items-center">
              <button
                onClick={() => handleColorChange(color.name)} // Sử dụng tên tiếng Việt
                className={`w-8 h-8 rounded-full border border-gray-500 cursor-pointer transition hover:scale-105 ${
                  filters.color === color.name ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              ></button>
            </div>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>

      {/* Material Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Chất Liệu
        </label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Giá Tiền</label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={1000000}
          step={50000}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-600 mt-2">
          <span>0₫</span>
          <span>{priceRange[1].toLocaleString()}₫</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
