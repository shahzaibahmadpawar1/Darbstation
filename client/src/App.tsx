import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import Assets from "@/pages/Assets";

type View = "login" | "dashboard" | "assets";

function App() {
  // todo: remove mock functionality
  const [currentView, setCurrentView] = useState<View>("login");
  const [selectedPumpId, setSelectedPumpId] = useState<number | null>(null);
  const [selectedPumpName, setSelectedPumpName] = useState<string>("");

  const handleLogin = (username: string, password: string) => {
    // todo: remove mock functionality
    console.log("Login:", username, password);
    // Mock login - in real app this would authenticate against the database
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setCurrentView("login");
    setSelectedPumpId(null);
    setSelectedPumpName("");
  };

  const [selectedPumpLocation, setSelectedPumpLocation] = useState<string>("");
  const [selectedPumpManager, setSelectedPumpManager] = useState<string>("");

  const handleViewAssets = (pumpId: number) => {
    // todo: remove mock functionality
    const pumpData: { [key: number]: { name: string; location: string; manager: string } } = {
      1: { name: "Al-Kharj Station", location: "Riyadh Road, Al-Kharj", manager: "Ahmed Al-Rashid" },
      2: { name: "Qiddiya Station", location: "Tuwaiq Road, Qiddiya", manager: "Mohammed Al-Saud" },
      3: { name: "Umrah District Station", location: "Makkah, Umrah District", manager: "Khalid Al-Harbi" },
    };
    const pump = pumpData[pumpId] || { name: "Unknown Station", location: "", manager: "" };
    setSelectedPumpId(pumpId);
    setSelectedPumpName(pump.name);
    setSelectedPumpLocation(pump.location);
    setSelectedPumpManager(pump.manager);
    setCurrentView("assets");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedPumpId(null);
    setSelectedPumpName("");
    setSelectedPumpLocation("");
    setSelectedPumpManager("");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {currentView === "login" ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <>
            <Header onLogout={handleLogout} />
            {currentView === "dashboard" ? (
              <Dashboard onViewAssets={handleViewAssets} />
            ) : currentView === "assets" && selectedPumpId ? (
              <Assets
                pumpId={selectedPumpId}
                pumpName={selectedPumpName}
                pumpLocation={selectedPumpLocation}
                pumpManager={selectedPumpManager}
                onBack={handleBackToDashboard}
              />
            ) : null}
          </>
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
