import './App.css'
import ReactDOM from "react-dom/client";
import { Routes, Route, Navigate } from "react-router";
import MapPage from "./pages/MapPage.jsx";

function App() {

  return (
    <Routes>
      <Route 
        path="/" 
        element={<MapPage />}
      >
       <Route index element={null} />
       <Route 
        path="station/:stationId"
        element={null}
       />
      </Route>
     
      <Route 
        path="*" 
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default App
