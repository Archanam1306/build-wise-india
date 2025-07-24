
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';

// Static Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import AboutUs from '@/pages/static/AboutUs';
import Contact from '@/pages/static/Contact';
import Policy from '@/pages/static/Policy';
import NotFound from '@/pages/NotFound';

// Contractor Pages
import Dashboard from '@/pages/contractor/Dashboard';
import CreateProject from '@/pages/contractor/CreateProject';
import Projects from '@/pages/contractor/Projects';
import DailyUpdates from '@/pages/contractor/DailyUpdates';
import Payments from '@/pages/contractor/Payments';
import PaymentConfirm from '@/pages/contractor/PaymentConfirm';
import Blueprints from '@/pages/contractor/Blueprints';
import GanttChart from '@/pages/contractor/GanttChart';
import Materials from '@/pages/contractor/Materials';
import PaintPicker from '@/pages/contractor/PaintPicker';
import Contacts from '@/pages/contractor/Contacts';

// Site Manager Pages
import SiteManagerDashboard from '@/pages/site-manager/Dashboard';
import SiteManagerDailyUpdates from '@/pages/site-manager/DailyUpdates';
import SiteManagerPayments from '@/pages/site-manager/Payments';
import SiteManagerMaterials from '@/pages/site-manager/Materials';
import SiteManagerBlueprints from '@/pages/site-manager/Blueprints';
import SiteManagerGantt from '@/pages/site-manager/GanttChart';
import SiteManagerContacts from '@/pages/site-manager/Contacts';

// Customer Pages
import CustomerDashboard from '@/pages/customer/Dashboard';
import CustomerProjects from '@/pages/customer/Projects';
import CustomerDailyUpdates from '@/pages/customer/DailyUpdates';
import CustomerPayments from '@/pages/customer/Payments';
import CustomerBlueprints from '@/pages/customer/Blueprints';
import CustomerGantt from '@/pages/customer/GanttChart';
import CustomerMaterials from '@/pages/customer/Materials';
import CustomerContacts from '@/pages/customer/Contacts';

// Shared Maintenance Page
import MaintenanceRequests from '@/pages/customer/MaintenanceRequests';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          
          {/* Contractor Routes */}
          <Route path="/contractor" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/create-project" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <CreateProject />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/projects" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <Projects />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/daily-updates" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <DailyUpdates />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/payments" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <Payments />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/payments/:paymentId/confirm" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <PaymentConfirm />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/blueprints" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <Blueprints />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/gantt" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <GanttChart />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/materials" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <Materials />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/paint-picker" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <PaintPicker />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/contacts" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <Contacts />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/contractor/maintenance-requests" element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <MainLayout>
                <MaintenanceRequests />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Site Manager Routes */}
          <Route path="/site-manager" element={
            <ProtectedRoute allowedRoles={['site-manager']}>
              <MainLayout>
                <SiteManagerDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/site-manager/daily-updates" element={
            <ProtectedRoute allowedRoles={['site-manager']}>
              <MainLayout>
                <SiteManagerDailyUpdates />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/site-manager/payments" element={
            <ProtectedRoute allowedRoles={['site-manager']}>
              <MainLayout>
                <SiteManagerPayments />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/site-manager/materials" element={
            <ProtectedRoute allowedRoles={['site-manager']}>
              <MainLayout>
                <SiteManagerMaterials />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/site-manager/blueprints" element={
            <ProtectedRoute allowedRoles={['site-manager']}>
              <MainLayout>
                <SiteManagerBlueprints />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/site-manager/gantt" element={
            <ProtectedRoute allowedRoles={['site-manager']}>
              <MainLayout>
                <SiteManagerGantt />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/site-manager/contacts" element={
            <ProtectedRoute allowedRoles={['site-manager']}>
              <MainLayout>
                <SiteManagerContacts />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/site-manager/maintenance-requests" element={
            <ProtectedRoute allowedRoles={['site-manager']}>
              <MainLayout>
                <MaintenanceRequests />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <CustomerDashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/customer/projects" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <CustomerProjects />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/customer/daily-updates" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <CustomerDailyUpdates />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/customer/payments" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <CustomerPayments />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/customer/blueprints" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <CustomerBlueprints />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/customer/gantt" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <CustomerGantt />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/customer/materials" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <CustomerMaterials />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/customer/contacts" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <CustomerContacts />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/customer/maintenance-requests" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <MainLayout>
                <MaintenanceRequests />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
