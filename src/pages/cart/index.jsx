import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../../hooks/useCart';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Cart = () => {
  const { cart, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const order = {
        items: cart,
        customer: customerData,
        total: getTotalPrice()
      };
      await api.createOrder(order);
      // Очистить корзину и показать успех
      localStorage.removeItem('cart');
      navigate('/quote-request'); // Перенаправить на страницу запроса КП
    } catch (error) {
      alert('Ошибка отправки заявки');
      console.error('Order submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Корзина пуста</h1>
          <p className="text-gray-600 mb-6">Добавьте товары в корзину для оформления заказа</p>
          <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Список товаров */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Товары в корзине</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Количество: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Цена: {item.price?.toLocaleString()} UZS</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900">
                      {(item.price * item.quantity)?.toLocaleString()} UZS
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Итого:</span>
                <span>{getTotalPrice()?.toLocaleString()} UZS</span>
              </div>
            </div>
          </div>

          {/* Форма заказа */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Оформление заказа</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
                <Input
                  type="text"
                  required
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  placeholder="Иванов Иван Иванович"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <Input
                  type="tel"
                  required
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  placeholder="+7 (999) 999-99-99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  required
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  placeholder="ivan@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                <Input
                  type="text"
                  value={customerData.company}
                  onChange={(e) => setCustomerData({...customerData, company: e.target.value})}
                  placeholder="ООО «Компания»"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6"
              >
                {isSubmitting ? 'Отправка...' : 'Оформить заказ'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
