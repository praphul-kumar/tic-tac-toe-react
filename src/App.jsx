import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import LocalMultiplayer from "./pages/LocalMultiplayer";
import OnlineMultiplayer from "./pages/OnlineMultiplayer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='local-multiplayer' element={<LocalMultiplayer />} />
          <Route path='online-multiplayer' element={<OnlineMultiplayer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
