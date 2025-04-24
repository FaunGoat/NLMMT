import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("sortBy", sortBy);
    setSearchParams(searchParams);
  };

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        id="sort"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
        className="border p-2 rounded-md focus:outline-none"
      >
        <option value="">Mặc Định</option>
        <option value="popularity">Bán chạy nhất</option>
        <option value="priceAsc">Giá: Tăng dần</option>
        <option value="priceDesc">Giá: Giảm dần</option>
      </select>
    </div>
  );
};

export default SortOptions;
