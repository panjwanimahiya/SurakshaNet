import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Loader2, Shield, Flame, Activity, MapPin, Phone, PhoneOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet's default icon path issues with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const redMarkerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type Category = "Hospitals" | "Police Stations" | "Fire Stations" | "Pharmacies";

interface POI {
  id: number;
  lat: number;
  lon: number;
  name: string;
  phone?: string;
}

// Component to handle map centering when location/POIs change
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
};

const NearbyHelp = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [category, setCategory] = useState<Category>("Hospitals");
  const [pois, setPois] = useState<POI[]>([]);
  const [loadingPois, setLoadingPois] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", description: "Your browser does not support Geolocation.", variant: "destructive" });
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location", error);
        toast({ title: "Location Error", description: "Failed to get your location. Please check browser permissions.", variant: "destructive" });
        setLoadingLocation(false);
      }
    );
  }, [toast]);

  useEffect(() => {
    if (location) {
      fetchPOIs(location.lat, location.lng, category);
    }
  }, [location, category]);

  const fetchPOIs = async (lat: number, lng: number, cat: Category) => {
    setLoadingPois(true);
    try {
      let amenity = "hospital";
      if (cat === "Police Stations") amenity = "police";
      if (cat === "Fire Stations") amenity = "fire_station";
      if (cat === "Pharmacies") amenity = "pharmacy";

      const radius = 5000;
      const query = `
        [out:json];
        (
          node["amenity"="${amenity}"](around:${radius},${lat},${lng});
          way["amenity"="${amenity}"](around:${radius},${lat},${lng});
          relation["amenity"="${amenity}"](around:${radius},${lat},${lng});
        );
        out center;
      `;

      let defaultPhone = "112";
      if (cat === "Police Stations") defaultPhone = "100";
      if (cat === "Fire Stations") defaultPhone = "101";
      if (cat === "Hospitals") defaultPhone = "102";
      if (cat === "Pharmacies") defaultPhone = "1800-891-2022"; // Popular pharmacy generic helpline / dial

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });
      const data = await response.json();
      
      const newPois = data.elements.map((e: any) => {
        const t = e.tags || {};
        const exactPhone = t.phone || t["contact:phone"] || t["contact:mobile"] || t.telephone || t["phone:mobile"] || t.whatsapp;
        
        return {
          id: e.id,
          lat: e.type === "node" ? e.lat : e.center.lat,
          lon: e.type === "node" ? e.lon : e.center.lon,
          name: t.name || "Unknown Name",
          phone: exactPhone || defaultPhone,
        };
      });
      setPois(newPois);
    } catch (error) {
      console.error("Error fetching POIs", error);
      toast({ title: "Map Error", description: "Could not fetch nearby places.", variant: "destructive" });
    } finally {
      setLoadingPois(false);
    }
  };

  const categories: { label: Category; icon: React.ReactNode }[] = [
    { label: "Hospitals", icon: <Activity className="w-6 h-6 md:w-8 md:h-8" /> },
    { label: "Police Stations", icon: <Shield className="w-6 h-6 md:w-8 md:h-8" /> },
    { label: "Fire Stations", icon: <Flame className="w-6 h-6 md:w-8 md:h-8" /> },
    { label: "Pharmacies", icon: <MapPin className="w-6 h-6 md:w-8 md:h-8" /> }, 
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 lg:px-12 pt-36 pb-24 max-w-[1800px] w-full">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground tracking-tight mb-4">Nearby Help</h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12">Find emergency services and help close to your current location.</p>

        {loadingLocation ? (
          <div className="flex flex-col items-center justify-center py-32 bg-card rounded-[2rem] border-2 shadow-[var(--shadow-card)]">
            <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
            <p className="text-2xl font-bold font-display">Detecting your location...</p>
          </div>
        ) : location ? (
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <Button 
                  key={cat.label}
                  variant={category === cat.label ? "default" : "outline"}
                  className={`h-16 px-6 md:px-8 text-lg md:text-xl font-bold rounded-2xl gap-3 transition-all ${category === cat.label ? "shadow-lg shadow-primary/30" : "hover:bg-secondary border-2"}`}
                  onClick={() => setCategory(cat.label)}
                >
                  {cat.icon}
                  {cat.label}
                </Button>
              ))}
            </div>
            
            <div className="grid lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr] gap-8 xl:gap-10">
              {/* Sidebar List */}
              <div className="bg-card rounded-[2rem] border-2 shadow-[var(--shadow-card)] flex flex-col h-[60vh] lg:h-[80vh] xl:h-[85vh] min-h-[500px] overflow-hidden">
                <div className="p-6 border-b-2 bg-secondary/30">
                  <h3 className="text-2xl font-display font-black">Nearby {category}</h3>
                  <p className="text-muted-foreground">{pois.length} places found in 5km</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingPois ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : pois.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">No places found nearby.</div>
                  ) : (
                    pois.map((poi) => (
                      <div key={poi.id} className="p-5 border-2 rounded-2xl hover:border-primary transition-colors group">
                        <p className="font-bold text-lg leading-tight mb-3 group-hover:text-primary transition-colors">{poi.name}</p>
                        {poi.phone ? (
                          <a href={`tel:${poi.phone}`} className="inline-flex items-center justify-center w-full gap-2 text-white bg-primary hover:bg-primary/90 font-bold py-3 rounded-xl transition-colors">
                            <Phone className="w-5 h-5" /> Call Now
                          </a>
                        ) : (
                          <div className="flex items-center justify-center w-full gap-2 text-muted-foreground bg-secondary/50 font-medium py-3 rounded-xl">
                            <PhoneOff className="w-5 h-5" /> No contact available
                          </div>
                        )}
                        {poi.phone && <p className="text-center mt-2 text-sm text-primary font-medium">{poi.phone}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="w-full bg-card rounded-[2rem] border-2 shadow-[var(--shadow-card)] overflow-hidden h-[60vh] lg:h-[80vh] xl:h-[85vh] min-h-[500px] relative">
                {loadingPois && (
                   <div className="absolute inset-0 z-[1000] bg-background/50 backdrop-blur-sm flex items-center justify-center">
                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                   </div>
                )}
                <MapContainer 
                  center={[location.lat, location.lng]} 
                  zoom={13} 
                  style={{ width: '100%', height: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapUpdater center={[location.lat, location.lng]} />
                  
                  {/* User's Location */}
                  <Marker position={[location.lat, location.lng]} icon={redMarkerIcon}>
                    <Popup>
                      <strong>You are here</strong>
                    </Popup>
                  </Marker>
  
                  {/* POI Locations */}
                  {pois.map((poi) => (
                    <Marker key={poi.id} position={[poi.lat, poi.lon]}>
                      <Popup>
                        <strong>{poi.name}</strong><br/>
                        {poi.phone && <a href={`tel:${poi.phone}`} className="text-primary font-bold">{poi.phone}</a>}
                        {!poi.phone && category}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-card rounded-[2rem] border-2 shadow-[var(--shadow-card)]">
            <MapPin className="w-16 h-16 text-muted-foreground mb-6" />
            <p className="text-2xl font-bold font-display">Location access denied</p>
            <p className="text-muted-foreground mt-2">Please enable location access to see nearby services.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyHelp;
