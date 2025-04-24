import { useState } from "react";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    "Áo", "Quần", "Áo Khoác", "Phụ Kiện"
  ]);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (category) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${category}"?`)) {
      setCategories(categories.filter((c) => c !== category));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Quản Lý Danh Mục</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Thêm danh mục..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thêm
        </button>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Tên Danh Mục</th>
              <th className="py-3 px-4">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{category}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-500">
                  Không có danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;
