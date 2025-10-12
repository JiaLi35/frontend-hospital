import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { CookiesProvider } from "react-cookie";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DoctorFind from "./pages/DoctorFind";
import ProfilePage from "./pages/ProfilePage";
import DoctorAdd from "./pages/DoctorAdd";
import SpecialtiesPage from "./pages/SpecialtiesPage";
import DoctorPage from "./pages/DoctorPage";
import AppointmentAdd from "./pages/AppointmentAdd";
import AppointmentView from "./pages/AppointmentView";
import AppointmentPage from "./pages/AppointmentPage";

function App() {
  return (
    <>
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doctors" element={<DoctorFind />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/add-doctor" element={<DoctorAdd />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/doctor/:id" element={<DoctorPage />} />
            <Route path="/book-appointment/:id" element={<AppointmentAdd />} />
            <Route
              path="/manage-appointments/:id"
              element={<AppointmentPage />}
            />
            <Route path="/appointment/:id" element={<AppointmentView />} />
            <Route path="/specialties" element={<SpecialtiesPage />} />
          </Routes>
          <Toaster closeButton />
        </BrowserRouter>
      </CookiesProvider>
    </>
  );
}

export default App;
