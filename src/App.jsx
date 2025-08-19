import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./scss/style.scss";
import Home from "./components/pages/landing/Home";
import Navbar from "./components/layout/Navbar";
import NotFoundPage from "./components/pages/NotFoundPage";
import Footer from "./components/layout/Footer";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/pages/Dashboard";
import ProtectedRoute from "./components/fragments/ProtectedRoute";
import { ShowOptionProvider } from "./hooks/ShowOptionProvider";
import GenerateImages from "./components/pages/GenerateImages";
import Editor from "./components/pages/Editor";
import AITools from "./components/pages/AITools";
import Backgrounds from "./components/pages/Backgrounds";
import UpScale from "./components/pages/UpScale";
import Categories from "./components/pages/landing/Categories";
import PlanAndPricing from "./components/pages/landing/PlanAndPricing";
import Learn from "./components/pages/landing/Learn";
import LearnTutorial from "./components/pages/landing/LearnTutorial";
import BlogPost from "./components/pages/landing/BlogPost";
import BgRemover from "./components/pages/BgRemover";

function App() {
  return (
    <ShowOptionProvider>
      <BrowserRouter>
        <Toaster position="bottom-center" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/pricing" element={<PlanAndPricing />} />
          <Route path="/blogs" element={<Learn />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/learn/tutorial" element={<LearnTutorial />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute component={Dashboard} />}
          />
          <Route
            path="/generate"
            element={<ProtectedRoute component={GenerateImages} />}
          />
          <Route
            path="/editor"
            element={<ProtectedRoute component={Editor} />}
          />
          <Route
            path="/bg-remover"
            element={<ProtectedRoute component={BgRemover} />}
          />
          <Route
            path="/ai-tools"
            element={<ProtectedRoute component={AITools} />}
          />
          <Route
            path="/backgrounds"
            element={<ProtectedRoute component={Backgrounds} />}
          />
          <Route
            path="/up-scale"
            element={<ProtectedRoute component={UpScale} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ShowOptionProvider>
  );
}

export default App;
