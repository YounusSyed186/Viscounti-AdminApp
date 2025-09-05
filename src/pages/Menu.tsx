import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const Menu = () => {
  const [activeTab, setActiveTab] = useState<string>("pizze-tradizionali");
  const [menuItems, setMenuItems] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/menu`);
        
        if (response.data && response.data.groupedItems && typeof response.data.groupedItems === 'object') {
          setMenuItems(response.data.groupedItems);
        } else {
          setError('La risposta dell\'API non è nel formato previsto');
        }
      } catch (err) {
        setError('Impossibile caricare i prodotti del menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const tabLabels = {
    "pizze-tradizionali": "🍕 Pizze Tradizionali",
    "pizze-speciali": "⭐ Pizze Speciali", 
    "calzoni": "🥟 Calzoni",
    "kebab-panini": "🥙 Kebab & Panini",
    "burgers": "🍔 Burgers & Contorni",
    "bibite": "🥤 Bibite",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Torna alla Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 text-7xl md:text-9xl">🍕</div>
        <div className="absolute bottom-1/3 right-1/4 text-6xl md:text-8xl">🥙</div>
        <div className="absolute top-2/3 left-1/4 text-5xl md:text-7xl">🍔</div>
        <div className="absolute top-1/2 right-1/3 text-6xl md:text-8xl">🥤</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gold">
            Il Nostro Menu Completo
          </h1>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
          Esplora la nostra selezione completa di pizze tradizionali, specialità, kebab e molto altro
        </p>

        {/* Menu Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full overflow-x-auto pb-2 mb-8 bg-card border border-border rounded-md">
            {Object.entries(tabLabels).map(([key, label]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-gold data-[state=active]:text-black font-medium"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(menuItems).map(([category, items]) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.isArray(items) && items.map((item, index) => (
                  <Card key={index} className="bg-card/80 backdrop-blur-sm border-border hover:border-gold/50 transition-all duration-300 hover:shadow-warm group overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='none'%3E%3Crect width='400' height='300' fill='%23F4F4F5'/%3E%3Cpath d='M200 150L150 120L100 150L150 180L200 150Z' fill='%23E5E5E5'/%3E%3Cpath d='M250 120L200 150L250 180L300 150L250 120Z' fill='%23E5E5E5'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-gold text-black font-bold py-1 px-2 rounded-md text-sm">
                        {item.price}
                      </div>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-serif font-semibold text-base sm:text-lg text-foreground group-hover:text-gold transition-colors mb-2">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Menu;