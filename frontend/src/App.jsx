import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Wind, Map as MapIcon, LayoutDashboard, ShieldCheck, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- PRODUCTION CONFIG ---
// This uses your .env variable if it exists, otherwise defaults to local
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// --- INJECT CUSTOM ANIMATIONS ---
const styleElement = document.createElement('style');
styleElement.innerHTML = `
  @keyframes circle-pulse {
    0% { fill-opacity: 0.1; stroke-width: 1; }
    50% { fill-opacity: 0.25; stroke-width: 3; }
    100% { fill-opacity: 0.1; stroke-width: 1; }
  }
  .pulse-circle { animation: circle-pulse 3s infinite ease-in-out; }
  .active-pulse-circle { animation: circle-pulse 1.5s infinite ease-in-out; }
`;
document.head.appendChild(styleElement);

const BAGMATI_CITIES = [
  { id: 1, name: "Kathmandu", lat: 27.7172, lng: 85.3240 },
  { id: 2, name: "Lalitpur", lat: 27.6644, lng: 85.3188 },
  { id: 3, name: "Bhaktapur", lat: 27.6710, lng: 85.4298 },
  { id: 4, name: "Hetauda", lat: 27.4277, lng: 85.0312 },
  { id: 5, name: "Bharatpur", lat: 27.6833, lng: 84.4333 },
  { id: 6, name: "Banepa", lat: 27.6298, lng: 85.5214 },
  { id: 7, name: "Dhulikhel", lat: 27.6253, lng: 85.5561 },
  { id: 8, name: "Bidur", lat: 27.9135, lng: 85.1542 }
];

const getAqiColor = (aqi) => {
    if (!aqi) return "#334155"; 
    if (aqi <= 50) return "#10b981"; 
    if (aqi <= 100) return "#f59e0b"; 
    if (aqi <= 150) return "#ef4444"; 
    return "#7c3aed"; 
};

const createAqiIcon = (aqi, isSelected) => {
    const color = getAqiColor(aqi);
    return L.divIcon({
        className: 'custom-aqi-icon',
        html: `
            <div style="
                background: ${color};
                color: white;
                padding: 5px 12px;
                border-radius: 14px;
                font-weight: 900;
                font-size: 14px;
                box-shadow: 0 0 20px ${color}66;
                border: 2px solid ${isSelected ? 'white' : 'rgba(255,255,255,0.2)'};
                transform: scale(${isSelected ? '1.2' : '1'});
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                min-width: 44px;
                text-align: center;
            ">
                ${aqi || '--'}
            </div>
        `,
        iconSize: [44, 32],
        iconAnchor: [22, 16]
    });
};

const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => { if (center) map.flyTo(center, 11, { duration: 1.5 }); }, [center]);
    return null;
};

const MapPage = () => {
    const [selectedId, setSelectedId] = useState(1); 
    const [cityData, setCityData] = useState({});

    const fetchCityData = async (id) => {
        const city = BAGMATI_CITIES.find(c => c.id === id);
        try {
            const res = await fetch(`${API_BASE_URL}/api/aqi/data?lat=${city.lat}&lng=${city.lng}`);
            const json = await res.json();
            if (json.status === "ok") {
                setCityData(prev => ({ ...prev, [id]: json }));
            }
        } catch (err) { console.error("Sync Error:", err); }
    };

    useEffect(() => {
        BAGMATI_CITIES.forEach(city => fetchCityData(city.id));
    }, []);

    const activeCity = BAGMATI_CITIES.find(c => c.id === selectedId);
    const activeData = cityData[selectedId];

    return (
        <div className="flex h-[calc(100vh-72px)] bg-[#0B0F1A]">
            <div className="w-80 border-r border-slate-800/60 bg-[#0B0F1A] p-6 z-20 flex flex-col">
                <div className="mb-6 space-y-4">
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Network Topology</h2>
                    <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Sensors Online</span>
                    </div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                    {BAGMATI_CITIES.map(city => {
                        const aqiValue = cityData[city.id]?.aqi;
                        return (
                            <button key={city.id} onClick={() => setSelectedId(city.id)}
                                className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                                    selectedId === city.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800/40 text-slate-400'
                                }`}>
                                <div className="text-left leading-tight">
                                    <p className="font-bold text-sm tracking-tight">{city.name}</p>
                                    <p className="text-[9px] opacity-60 uppercase font-black tracking-widest mt-1">Live Feed</p>
                                </div>
                                <div className="w-3 h-3 rounded-full shadow-inner border border-white/10" 
                                     style={{ backgroundColor: getAqiColor(aqiValue) }} />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 relative">
                <MapContainer center={[activeCity.lat, activeCity.lng]} zoom={10} className="h-full w-full">
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    <MapController center={[activeCity.lat, activeCity.lng]} />
                    
                    {BAGMATI_CITIES.map(city => {
                        const aqiValue = cityData[city.id]?.aqi;
                        const color = getAqiColor(aqiValue);
                        const isSelected = selectedId === city.id;

                        return (
                            <React.Fragment key={city.id}>
                                <Circle 
                                    center={[city.lat, city.lng]} 
                                    radius={4500} 
                                    className={isSelected ? "active-pulse-circle" : "pulse-circle"}
                                    pathOptions={{ fillColor: color, color: color, weight: isSelected ? 3 : 1 }} 
                                />
                                <Marker 
                                    position={[city.lat, city.lng]} 
                                    icon={createAqiIcon(aqiValue, isSelected)}
                                    eventHandlers={{ click: () => setSelectedId(city.id) }}
                                />
                            </React.Fragment>
                        );
                    })}
                </MapContainer>

                {activeData && (
                    <div className="absolute bottom-8 left-8 right-8 z-[1000] flex justify-center pointer-events-none">
                        <div className="max-w-4xl w-full bg-[#161B22]/90 backdrop-blur-2xl border border-white/10 p-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center gap-8 pointer-events-auto">
                            <div className="text-center bg-black/40 px-8 py-5 rounded-3xl border border-white/5 min-w-[140px]">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">AQI Level</p>
                                <p className="text-5xl font-black tracking-tighter" style={{color: getAqiColor(activeData.aqi)}}>{activeData.aqi}</p>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-2 mb-2">
                                    <ShieldCheck size={18} className="text-blue-400" /> Environment Health: {activeCity.name}
                                </h3>
                                <p className="text-slate-300 text-xl font-medium leading-snug italic">"{activeData.advice}"</p>
                                <div className="mt-3 flex items-center gap-4 text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                                    <span>Signal: Calibrated</span>
                                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                    <span>Update: Just Now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/aqi`)
            .then(res => res.json())
            .then(json => setData(json))
            .catch(() => setData({aqi: 0, advice: "Offline", station: "N/A"}));
    }, []);
    if (!data) return <div className="h-screen bg-[#0B0F1A] flex items-center justify-center font-black text-slate-500 uppercase tracking-[0.5em] animate-pulse">Syncing...</div>;
    return (
        <div className="min-h-[calc(100vh-72px)] bg-[#0B0F1A] p-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-12 opacity-50"><div className="h-px flex-1 bg-slate-800"></div><h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Atmospheric Data</h2><div className="h-px flex-1 bg-slate-800"></div></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="md:col-span-2 bg-[#161B22] border border-slate-800 p-12 rounded-[4rem] shadow-2xl text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2" style={{backgroundColor: getAqiColor(data.aqi)}}></div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">Current Air Quality Index</p>
                        <h1 className="text-[12rem] font-black text-white leading-none tracking-tighter mb-6 group-hover:scale-105 transition-all duration-500">{data.aqi}</h1>
                        <div className="px-10 py-3 inline-block rounded-full text-white font-black text-xl tracking-tighter shadow-xl" style={{backgroundColor: getAqiColor(data.aqi)}}>
                            {data.aqi <= 50 ? 'EXCELLENT' : data.aqi <= 100 ? 'MODERATE' : 'POOR'}
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#161B22] border border-slate-800 p-8 rounded-[2.5rem] flex-1">
                            <Info className="text-blue-500 mb-4" size={24} />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Station</p>
                            <p className="text-xl font-bold text-white truncate">{data.station}</p>
                        </div>
                        <div className="bg-[#161B22] border border-slate-800 p-8 rounded-[2.5rem] flex-1">
                            <ShieldCheck className="text-emerald-500 mb-4" size={24} />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Status</p>
                            <p className="text-xl font-bold text-white uppercase tracking-tighter">Live Sensor</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Navbar = () => (
    <nav className="h-[72px] bg-[#0B0F1A] border-b border-slate-800/60 flex items-center justify-between px-10 sticky top-0 z-[2000]">
        <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/30"><Wind className="text-white" size={20} /></div>
            <span className="text-lg font-black tracking-tighter text-white uppercase">SkySentry <span className="text-blue-500">PRO</span></span>
        </div>
        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"><MapIcon size={14}/> Grid Map</Link>
            <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"><LayoutDashboard size={14}/> Analytics</Link>
        </div>
    </nav>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0B0F1A] font-sans selection:bg-blue-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer limit={1} theme="dark" position="bottom-right" />
      </div>
    </Router>
  );
}