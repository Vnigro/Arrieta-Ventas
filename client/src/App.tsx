import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import Sell from "./pages/Sell";
import VehicleDetail from "./pages/VehicleDetail";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/vehiculos" component={Inventory} /><Route path="/vehiculos/:slug" component={VehicleDetail} /><Route path="/vender" component={Sell} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster position="top-center" richColors /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
