import "./App.css";
import HeaderComponent from "./components/HeaderComponent";
import SignUpComponent from "./components/SignUpComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import HomeComponent from "./components/HomeComponent";
import ProductDetailComponent from "./components/ProductDetailComponent";
import OrderComponent from "./components/OrderComponent";
import MyCartComponent from "./components/MyCartComponent";
import TestComponent from "./components/TestComponent";

function App() {
  return (
    <Router>
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/signup" element={<SignUpComponent />} />
        <Route path="/test" element={<TestComponent />} />
        <Route path="/products" element={<HomeComponent />} />
        <Route
          path="/login/:product?/:quantity?"
          element={<LoginComponent />}
        />
        <Route path="/orders" element={<OrderComponent />} />
        <Route
          path="/product/:productId"
          element={<ProductDetailComponent />}
        />
        <Route path="/cart" element={<MyCartComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
