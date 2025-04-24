import { useEffect, useRef } from "react";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Filter Sidebar */}
      <div ref={sidebarRef}>
        <FilterSidebar />
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">Tất Cả Sản Phẩm</h2>
        <h2>
          {/* Sort Options */}
          <SortOptions />

          {/* Product Grid */}
          <ProductGrid products={products} loading={loading} error={error} />
        </h2>
      </div>
    </div>
  );
};

export default CollectionPage;
