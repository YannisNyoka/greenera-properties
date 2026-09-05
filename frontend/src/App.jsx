import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyListings from './pages/PropertyListings';
import PropertyDetail from './pages/PropertyDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import PropertyForm from './pages/admin/PropertyForm';
import AdminAgents from './pages/admin/AdminAgents';
import AgentForm from './pages/admin/AgentForm';
import Contact from './pages/Contact';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import Agents from './pages/Agents';
import AgentProfile from './pages/AgentProfile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<PropertyListings />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/properties/:slug" element={<PropertyDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/agents" element={<Agents />} />
<Route path="/agents/:id" element={<AgentProfile />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/enquiries" element={<ProtectedRoute><AdminEnquiries /></ProtectedRoute>} />
          <Route path="/admin/properties/new" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
<Route path="/admin/properties/:id/edit" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
<Route path="/admin/agents" element={<ProtectedRoute><AdminAgents /></ProtectedRoute>} />
<Route path="/admin/agents/new" element={<ProtectedRoute><AgentForm /></ProtectedRoute>} />
<Route path="/admin/agents/:id/edit" element={<ProtectedRoute><AgentForm /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;