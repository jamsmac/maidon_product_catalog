import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { 
  Calculator,
  Save,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  ArrowRight,
  Percent,
  Calendar
} from 'lucide-react';

const FinancingCalculator = () => {
  const [calculationInputs, setCalculationInputs] = useState({
    equipmentPrice: 5000000,
    downPayment: 1000000,
    termLength: 60,
    interestRate: 12.5,
    financingType: 'purchase',
    taxRate: 20,
    residualValue: 15,
    seasonalPayments: false,
    balloonPayment: 0
  });

  const [results, setResults] = useState({});
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [prequalificationStatus, setPrequalificationStatus] = useState(null);

  const financingTypes = [
    { value: 'purchase', label: 'Покупка в кредит', description: 'Полное владение после выплаты' },
    { value: 'operating_lease', label: 'Операционный лизинг', description: 'Аренда с возможностью выкупа' },
    { value: 'capital_lease', label: 'Финансовый лизинг', description: 'Лизинг с переходом права собственности' },
    { value: 'rental', label: 'Аренда', description: 'Краткосрочная аренда без покупки' }
  ];

  const termOptions = [
    { value: 12, label: '1 год' },
    { value: 24, label: '2 года' },
    { value: 36, label: '3 года' },
    { value: 48, label: '4 года' },
    { value: 60, label: '5 лет' },
    { value: 72, label: '6 лет' },
    { value: 84, label: '7 лет' }
  ];

  const approvedLenders = [
    { name: 'Узнацбанк Лизинг', rate: '18.5%', approval: '95%', logo: '/assets/images/no_image.png' },
    { name: 'Узпромстройбанк', rate: '19.0%', approval: '88%', logo: '/assets/images/no_image.png' },
    { name: 'Кредит-Лизинг', rate: '20.5%', approval: '92%', logo: '/assets/images/no_image.png' },
    { name: 'Ipak Yoli Bank', rate: '19.8%', approval: '85%', logo: '/assets/images/no_image.png' }
  ];

  useEffect(() => {
    calculatePayments();
  }, [calculationInputs]);

  const calculatePayments = () => {
    const { 
      equipmentPrice, 
      downPayment, 
      termLength, 
      interestRate, 
      financingType,
      taxRate,
      residualValue,
      balloonPayment
    } = calculationInputs;

    const principal = equipmentPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    
    let monthlyPayment = 0;
    let totalCost = 0;
    let totalInterest = 0;

    if (financingType === 'purchase') {
      // Standard loan calculation
      if (balloonPayment > 0) {
        const balloonPrincipal = balloonPayment;
        const regularPrincipal = principal - balloonPrincipal;
        monthlyPayment = (regularPrincipal * monthlyRate * Math.pow(1 + monthlyRate, termLength)) / 
                         (Math.pow(1 + monthlyRate, termLength) - 1);
        totalCost = monthlyPayment * termLength + balloonPayment + downPayment;
      } else {
        monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termLength)) / 
                         (Math.pow(1 + monthlyRate, termLength) - 1);
        totalCost = monthlyPayment * termLength + downPayment;
      }
      totalInterest = totalCost - equipmentPrice;
    } else if (financingType === 'operating_lease') {
      // Operating lease calculation
      const depreciationCost = equipmentPrice * (100 - residualValue) / 100;
      const financingCost = equipmentPrice * monthlyRate;
      monthlyPayment = (depreciationCost + financingCost) / termLength;
      totalCost = monthlyPayment * termLength + downPayment;
      totalInterest = totalCost - equipmentPrice + (equipmentPrice * residualValue / 100);
    } else if (financingType === 'capital_lease') {
      // Capital lease calculation (similar to purchase)
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termLength)) / 
                       (Math.pow(1 + monthlyRate, termLength) - 1);
      totalCost = monthlyPayment * termLength + downPayment;
      totalInterest = totalCost - equipmentPrice;
    } else if (financingType === 'rental') {
      // Rental calculation
      monthlyPayment = equipmentPrice * 0.05; // 5% of equipment value per month
      totalCost = monthlyPayment * termLength;
      totalInterest = totalCost - equipmentPrice;
    }

    const taxSavings = (monthlyPayment * termLength) * (taxRate / 100);
    const roi = ((equipmentPrice * 0.15 * termLength / 12) - totalInterest) / equipmentPrice * 100; // Assuming 15% annual return

    setResults({
      monthlyPayment,
      totalCost,
      totalInterest,
      taxSavings,
      roi,
      costOfOwnership: totalCost - taxSavings,
      residualValue: financingType === 'operating_lease' ? equipmentPrice * residualValue / 100 : 0
    });
  };

  const handleInputChange = (field, value) => {
    setCalculationInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const saveCalculation = () => {
    const calculation = {
      id: Date.now(),
      date: new Date()?.toLocaleDateString('ru-RU'),
      ...calculationInputs,
      ...results
    };
    setSavedCalculations(prev => [...prev, calculation]);
    alert('Расчет сохранен!');
  };

  const requestFinancingQuote = () => {
    alert('Перенаправление к форме запроса финансирования...');
  };

  const connectWithSpecialist = () => {
    alert('Соединение со специалистом по финансированию...');
  };

  const checkPrequalification = () => {
    // Mock prequalification check
    setTimeout(() => {
      setPrequalificationStatus({
        approved: true,
        maxAmount: 15000000,
        estimatedRate: 18.8,
        lender: 'Узнацбанк Лизинг'
      });
    }, 2000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Калькулятор финансирования</h1>
              <p className="text-gray-600 mt-1">Рассчитайте варианты покупки, лизинга и аренды техники</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={saveCalculation}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Сохранить расчет
              </Button>
              <Button 
                onClick={connectWithSpecialist}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Users className="w-4 h-4" />
                Связаться со специалистом
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Параметры расчета
              </h2>

              <div className="space-y-6">
                {/* Financing Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Тип финансирования
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {financingTypes?.map((type) => (
                      <label key={type?.value} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="financingType"
                          value={type?.value}
                          checked={calculationInputs?.financingType === type?.value}
                          onChange={(e) => handleInputChange('financingType', e?.target?.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{type?.label}</div>
                          <div className="text-sm text-gray-500">{type?.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Equipment Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Стоимость техники
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="number"
                      value={calculationInputs?.equipmentPrice}
                      onChange={(e) => handleInputChange('equipmentPrice', e?.target?.value)}
                      className="pl-10"
                      placeholder="5000000"
                    />
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Первоначальный взнос
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="number"
                      value={calculationInputs?.downPayment}
                      onChange={(e) => handleInputChange('downPayment', e?.target?.value)}
                      className="pl-10"
                      placeholder="1000000"
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {((calculationInputs?.downPayment / calculationInputs?.equipmentPrice) * 100)?.toFixed(1)}% от стоимости
                  </div>
                </div>

                {/* Term Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Срок финансирования
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Select
                      value={calculationInputs?.termLength}
                      onChange={(e) => handleInputChange('termLength', e?.target?.value)}
                      className="pl-10"
                    >
                      {termOptions?.map((option) => (
                        <option key={option?.value} value={option?.value}>{option?.label}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Процентная ставка (% годовых)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="number"
                      step="0.1"
                      value={calculationInputs?.interestRate}
                      onChange={(e) => handleInputChange('interestRate', e?.target?.value)}
                      className="pl-10"
                      placeholder="12.5"
                    />
                  </div>
                </div>

                {/* Advanced Options Toggle */}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="w-full"
                  >
                    {showAdvancedOptions ? 'Скрыть' : 'Показать'} дополнительные параметры
                  </Button>
                </div>

                {/* Advanced Options */}
                {showAdvancedOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-4 border-t"
                  >
                    {/* Tax Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Налоговая ставка (%)
                      </label>
                      <Input
                        type="number"
                        value={calculationInputs?.taxRate}
                        onChange={(e) => handleInputChange('taxRate', e?.target?.value)}
                        placeholder="20"
                      />
                    </div>

                    {/* Residual Value (for leasing) */}
                    {(calculationInputs?.financingType === 'operating_lease') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Остаточная стоимость (%)
                        </label>
                        <Input
                          type="number"
                          value={calculationInputs?.residualValue}
                          onChange={(e) => handleInputChange('residualValue', e?.target?.value)}
                          placeholder="15"
                        />
                      </div>
                    )}

                    {/* Balloon Payment */}
                    {calculationInputs?.financingType === 'purchase' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Баллонный платеж
                        </label>
                        <Input
                          type="number"
                          value={calculationInputs?.balloonPayment}
                          onChange={(e) => handleInputChange('balloonPayment', e?.target?.value)}
                          placeholder="0"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Prequalification */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Предварительное одобрение
              </h3>
              
              {!prequalificationStatus ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Получите предварительное одобрение от партнеров-кредиторов
                  </p>
                  <Button onClick={checkPrequalification} className="bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Проверить одобрение
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Предварительно одобрено</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Максимальная сумма:</span>
                      <div className="font-semibold">{formatCurrency(prequalificationStatus?.maxAmount)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Ставка от:</span>
                      <div className="font-semibold">{prequalificationStatus?.estimatedRate}%</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Кредитор:</span>
                    <div className="font-semibold">{prequalificationStatus?.lender}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Результаты расчета
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Monthly Payment */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Ежемесячный платеж</span>
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(results?.monthlyPayment || 0)}
                  </div>
                </div>

                {/* Total Cost */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Общая стоимость</span>
                    <DollarSign className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(results?.totalCost || 0)}
                  </div>
                </div>

                {/* Total Interest */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-700">Переплата</span>
                    <Percent className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-xl font-bold text-red-900">
                    {formatCurrency(results?.totalInterest || 0)}
                  </div>
                </div>

                {/* Tax Savings */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Налоговая экономия</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-xl font-bold text-green-900">
                    {formatCurrency(results?.taxSavings || 0)}
                  </div>
                </div>

                {/* ROI */}
                {results?.roi !== undefined && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-700">ROI</span>
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-xl font-bold text-purple-900">
                      {results?.roi?.toFixed(1)}%
                    </div>
                  </div>
                )}

                {/* Residual Value */}
                {results?.residualValue > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-700">Остаточная стоимость</span>
                      <Info className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="text-xl font-bold text-yellow-900">
                      {formatCurrency(results?.residualValue)}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                <Button 
                  onClick={requestFinancingQuote}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Запросить предложение по финансированию
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={saveCalculation}>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Важная информация:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Расчеты носят предварительный характер</li>
                      <li>• Итоговые условия определяются кредитором</li>
                      <li>• Учтены базовые налоговые льготы</li>
                      <li>• ROI рассчитан при доходности 15% годовых</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Сравнение вариантов финансирования
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Параметр</th>
                      <th className="text-center py-2">Покупка</th>
                      <th className="text-center py-2">Лизинг</th>
                      <th className="text-center py-2">Аренда</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Ежемесячный платеж</td>
                      <td className="text-center py-2">{formatCurrency(results?.monthlyPayment || 0)}</td>
                      <td className="text-center py-2">~{formatCurrency((results?.monthlyPayment || 0) * 0.8)}</td>
                      <td className="text-center py-2">~{formatCurrency((results?.monthlyPayment || 0) * 1.5)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Владение</td>
                      <td className="text-center py-2">Да</td>
                      <td className="text-center py-2">Опционально</td>
                      <td className="text-center py-2">Нет</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-600">Налоговые льготы</td>
                      <td className="text-center py-2">Частично</td>
                      <td className="text-center py-2">Полные</td>
                      <td className="text-center py-2">Полные</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Approved Lenders */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Партнеры-кредиторы
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {approvedLenders?.map((lender, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={lender?.logo}
                        alt={lender?.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{lender?.name}</h4>
                        <p className="text-sm text-gray-500">Ставка от {lender?.rate}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Одобрение:</span>
                      <span className="font-medium text-green-600">{lender?.approval}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      <ArrowRight className="w-3 h-3 mr-2" />
                      Подать заявку
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancingCalculator;