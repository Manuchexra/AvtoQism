import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductCategory from './pages/ProductCategory';
import ProductSubCategory from './pages/ProductSubCategory';
import CartPage from './pages/CartPage';
import Cart from './components/Cart';
import './styles/App.css';

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.p_id === product.p_id);
      if (existingItem) {
        return prevItems.map(item =>
          item.p_id === product.p_id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.p_id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.p_id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="logo">
            <Link to="/">G'ILDIRAK</Link>
          </div>
          <nav className="nav">
            <Link to="/">Bosh sahifa</Link>
            <Link to="/category/1">Shinalar & G'ildiraklar</Link>
            <Link to="/category/2">Tashqi qismlar</Link>
            <Link to="/category/3">Ichki qismlar</Link>
            <Link to="/category/4">Avto qismlar</Link>
          </nav>
          <Cart itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/category/:id" 
              element={<ProductCategory />} 
            />
            <Route 
              path="/subcategory/:catId/:subId" 
              element={<ProductSubCategory addToCart={addToCart} />} 
            />
            <Route 
              path="/cart" 
              element={
                <CartPage 
                  cartItems={cartItems} 
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              } 
            />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2023 G'ILDIRAK. Barcha huquqlar himoyalangan.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;