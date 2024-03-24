import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "@pages/Home";
const About = lazy(() => import("@pages/About"));
const UpdateListing = lazy(() => import("@pages/UpdateListing"));
import { Search, Listing, Profile, CreateListing, SignIn, SignUp} from "@pages"
import { PrivateRoute, Header } from "@components"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18n from "./i8n/i18n";

function App() {
  return (
    <BrowserRouter>
    <Suspense fallback={<h1>Still Loading…</h1>}>
    <Header />
    </Suspense>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/sign-in"
          element={
            <Suspense fallback={<h1>Still Loading…</h1>}>
              <SignIn />
            </Suspense>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Suspense fallback={<h1>Still Loading…</h1>}>
              <SignUp />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<h1>Still Loading…</h1>}>
              <About />
            </Suspense>
          }
        />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/create-listing"
            element={
              <Suspense fallback={<h1>Still Loading…</h1>}>
                <CreateListing />
              </Suspense>
            }
          />
          <Route
            path="/update-listing/:listingId"
            element={
              <Suspense fallback={<h1>Still Loading…</h1>}>
                <UpdateListing />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;




