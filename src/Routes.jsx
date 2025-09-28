import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProductDetail from './pages/product-detail';
import PartsCatalog from './pages/parts-catalog';
import ServiceScheduling from './pages/service-scheduling';
import QuoteRequest from './pages/quote-request';
import ProductConfigurator from './pages/product-configurator';
import ProductComparison from './pages/product-comparison';
import FinancingCalculator from './pages/financing-calculator';
import EquipmentDashboard from './pages/equipment-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<PartsCatalog />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/parts-catalog" element={<PartsCatalog />} />
        <Route path="/service-scheduling" element={<ServiceScheduling />} />
        <Route path="/quote-request" element={<QuoteRequest />} />
        <Route path="/product-configurator" element={<ProductConfigurator />} />
        <Route path="/product-comparison" element={<ProductComparison />} />
        <Route path="/financing-calculator" element={<FinancingCalculator />} />
        <Route path="/equipment-dashboard" element={<EquipmentDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
