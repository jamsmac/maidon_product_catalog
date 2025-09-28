import ErrorBoundary from "components/ErrorBoundary";
import ScrollToTop from "components/ScrollToTop";
import NotFound from "pages/NotFound";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";

// Route-based code splitting
const Cart = lazy(() => import("./pages/cart"));
const Catalog = lazy(() => import("./pages/catalog"));
const EquipmentDashboard = lazy(() => import("./pages/equipment-dashboard"));
const FinancingCalculator = lazy(() => import("./pages/financing-calculator"));
const Login = lazy(() => import("./pages/login"));
const PartsCatalog = lazy(() => import("./pages/parts-catalog"));
const ProductComparison = lazy(() => import("./pages/product-comparison"));
const ProductConfigurator = lazy(() => import("./pages/product-configurator"));
const ProductDetail = lazy(() => import("./pages/product-detail"));
const QuoteRequest = lazy(() => import("./pages/quote-request"));
const ServiceScheduling = lazy(() => import("./pages/service-scheduling"));

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Загрузка...</div>}>
          <RouterRoutes>
            <Route path="/" element={<PartsCatalog />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/parts-catalog" element={<PartsCatalog />} />
            <Route path="/service-scheduling" element={<ServiceScheduling />} />
            <Route path="/quote-request" element={<QuoteRequest />} />
            <Route path="/product-configurator" element={<ProductConfigurator />} />
            <Route path="/product-comparison" element={<ProductComparison />} />
            <Route path="/financing-calculator" element={<FinancingCalculator />} />
            <Route path="/equipment-dashboard" element={<EquipmentDashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
