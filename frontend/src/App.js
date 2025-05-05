import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PlantDetails from "./pages/PlantDetails";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlantProvider } from './context/PlantContext';

function App() {
    return (
        <PlantProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/plant/:id" element={<PlantDetails />} />
                    </Routes>
                </div>
            </Router>
        </PlantProvider>
    );
}

export default App;
