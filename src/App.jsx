import React from "react";

import { AuthProvider } from "./contexts/AuthContext";
import ToastProviderWrapper from "./hooks/ToastProvider";
import { ToastContainer } from "./components/ui/Toast";
import Routes from "./Routes";

function App() {
  return (
    <ToastProviderWrapper>
      <AuthProvider>
        <Routes />
        <ToastContainer />
      </AuthProvider>
    </ToastProviderWrapper>
  );
}

export default App;
