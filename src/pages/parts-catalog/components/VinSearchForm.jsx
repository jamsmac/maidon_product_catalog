import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const VinSearchForm = ({ onSearch, isLoading }) => {
  const [vinNumber, setVinNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [searchType, setSearchType] = useState('vin');

  const handleSubmit = (e) => {
    e?.preventDefault();
    const searchValue = searchType === 'vin' ? vinNumber : serialNumber;
    if (searchValue?.trim()) {
      onSearch(searchValue, searchType);
    }
  };

  const handleClear = () => {
    setVinNumber('');
    setSerialNumber('');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Search" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Поиск запчастей
          </h2>
          <p className="text-sm text-muted-foreground">
            Найдите совместимые детали по VIN или серийному номеру
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Type Toggle */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => setSearchType('vin')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              searchType === 'vin' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Car" size={16} className="inline mr-2" />
            VIN номер
          </button>
          <button
            type="button"
            onClick={() => setSearchType('serial')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              searchType === 'serial' ?'bg-card text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Hash" size={16} className="inline mr-2" />
            Серийный номер
          </button>
        </div>

        {/* Input Field */}
        {searchType === 'vin' ? (
          <Input
            label="VIN номер"
            type="text"
            placeholder="Введите 17-значный VIN номер"
            value={vinNumber}
            onChange={(e) => setVinNumber(e?.target?.value?.toUpperCase())}
            maxLength={17}
            description="Например: 1HGBH41JXMN109186"
            className="font-data"
          />
        ) : (
          <Input
            label="Серийный номер"
            type="text"
            placeholder="Введите серийный номер оборудования"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e?.target?.value)}
            description="Найдите номер на табличке оборудования"
            className="font-data"
          />
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Search"
            iconPosition="left"
            className="flex-1"
            disabled={searchType === 'vin' ? vinNumber?.length < 17 : !serialNumber?.trim()}
          >
            Найти запчасти
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            iconName="X"
            size="icon"
            disabled={!vinNumber && !serialNumber}
          />
        </div>
      </form>
      {/* Quick Tips */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Где найти номера:</p>
            <ul className="space-y-1">
              <li>• VIN: на раме или в документах на технику</li>
              <li>• Серийный номер: на заводской табличке</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VinSearchForm;