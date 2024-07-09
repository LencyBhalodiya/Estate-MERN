import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { PrivateRoute, Header } from "@components"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { privateRoutes, publicRoutes } from "./routes";
import i18n from "./i8n/i18n";  

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<h1>Still Loading…</h1>}>
        <Header />
      </Suspense>
      <ToastContainer />
      <Suspense fallback={<h1>Still Loading…</h1>}>
        <Routes>
          {publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route element={<PrivateRoute />}>
            {privateRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;




