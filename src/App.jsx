import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import StandardDocuments from './pages/StandardDocuments';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <Router basename="/raychanproducts">
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/documents" element={<StandardDocuments />} />
        <Route path="/details" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
