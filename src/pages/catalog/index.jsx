import { useState, useEffect } from 'react';

import { api } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: 0,
    maxPrice: 100000000,
    category: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        setError('Ошибка загрузки продуктов');
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;

    // Simple category filtering based on product name
    const matchesCategory = !filters.category ||
                           product.name.toLowerCase().includes(filters.category.toLowerCase());

    return matchesSearch && matchesPrice && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900">Загрузка каталога...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ошибка загрузки</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Каталог промышленного оборудования</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Широкий ассортимент техники для любых задач: погрузчики, экскаваторы, краны и многое другое
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
              <Input
                type="text"
                placeholder="Название или описание..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Мин. цена</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value) || 0})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Макс. цена</label>
              <Input
                type="number"
                placeholder="100000000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value) || 100000000})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
              <Select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">Все категории</option>
                <option value="погрузчик">Погрузчики</option>
                <option value="экскаватор">Экскаваторы</option>
                <option value="кран">Автокраны</option>
                <option value="бульдозер">Бульдозеры</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Найдено товаров: {filteredProducts.length}
          </h2>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Товары не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
