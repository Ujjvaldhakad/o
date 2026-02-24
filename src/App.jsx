import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Science from "./data/Science";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/middle/8/science" element={<Science />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;