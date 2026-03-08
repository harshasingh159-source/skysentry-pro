const MapPage = () => {
  const [nodes, setNodes] = useState([]);
  
  // Mock data for global nodes (Replace this with a fetch to your real backend later)
  const globalNodes = [
    { id: 1, city: "Kathmandu", pos: [27.7172, 85.3240], aqi: 91, pm25: 40.3 },
    { id: 2, city: "New Delhi", pos: [28.6139, 77.2090], aqi: 180, pm25: 110.5 },
    { id: 3, city: "Oslo", pos: [59.9139, 10.7522], aqi: 12, pm25: 4.1 },
    { id: 4, city: "New York", pos: [40.7128, -74.0060], aqi: 45, pm25: 12.0 },
    { id: 5, city: "Sydney", pos: [-33.8688, 151.2093], aqi: 22, pm25: 6.5 }
  ];

  useEffect(() => {
    // For now, setting mock data. Later: fetch('http://127.0.0.1:8000/api/global-aqi')
    setNodes(globalNodes);
  }, []);

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return "#10b981"; // Healthy (Green)
    if (aqi <= 100) return "#f59e0b"; // Moderate (Orange)
    return "#f43f5e"; // Hazardous (Red)
  };

  return (
    <div className="p-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Global Atmospheric Grid</h1>
          <p className="text-slate-500 font-medium italic">Monitoring {nodes.length} Active International Nodes</p>
        </div>
      </div>
      
      <div className="h-[650px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white relative z-0">
        <MapContainer 
          center={[20, 0]} // Zoom out to see the whole world
          zoom={2} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          <MapResizeFix /> 
          
          {nodes.map((node) => (
            <React.Fragment key={node.id}>
              {/* Individual Marker for each city */}
              <Marker position={node.pos}>
                <Popup>
                  <div className="text-center font-sans p-1">
                    <p className="font-black text-blue-600 uppercase text-[10px]">{node.city} Node</p>
                    <p className="text-xl font-black text-slate-800">{node.aqi} AQI</p>
                    <p className="text-[10px] text-slate-400">PM2.5: {node.pm25}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Individual Circle for each city */}
              <Circle 
                center={node.pos} 
                radius={300000} // Radius increased for global visibility (300km)
                pathOptions={{ 
                  fillColor: getAqiColor(node.aqi), 
                  color: getAqiColor(node.aqi), 
                  weight: 1,
                  fillOpacity: 0.4 
                }} 
              />
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};