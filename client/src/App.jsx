import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "@pages/Home";
const SignIn = lazy(() => import("@pages/SignIn"));
const SignUp = lazy(() => import("@pages/SignUp"));
const About = lazy(() => import("@pages/About"));
const UpdateListing = lazy(() => import("@pages/UpdateListing"));
const CreateListing = lazy(() => import("@pages/CreateListing"));
import { Search, Listing, Profile } from "@pages"
import { PrivateRoute, Header } from "@components"

function App() {
    return (
      <BrowserRouter>
        <Header />
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




