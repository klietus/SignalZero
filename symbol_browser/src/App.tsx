import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import SymbolList from "./pages/SymbolList";
import SymbolDetail from "./pages/SymbolDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SymbolList />} />
      <Route path="/symbol/:id" element={<SymbolDetail />} />
    </Routes>
  );
  
}
