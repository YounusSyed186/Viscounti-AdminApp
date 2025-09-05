import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  UtensilsCrossed, 
  ShoppingCart,
  DollarSign,
  Clock
} from 'lucide-react';
import axios from "axios";

const Dashboard = () => {
  const [menuCount, setMenuCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch total menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/menu`);
        // Count total items
        const total = Object.values(res.data.groupedItems).reduce((acc: number, arr: any[]) => acc + arr.length, 0);
        setMenuCount(total);
      } catch (err) {
        console.error("Errore nel caricamento del menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const stats = [
    {
      title: "Ordini Totali Oggi",
      value: "Prossimamente",
      icon: ShoppingCart,
      color: "text-green-500"
    },
    {
      title: "Incasso Oggi", 
      value: "Prossimamente",
      icon: DollarSign,
      color: "text-blue-500"
    },
    {
      title: "Elementi nel Menu",
      value: loading ? "Caricamento..." : menuCount ?? "0",
      icon: UtensilsCrossed,
      color: "text-orange-500"
    },
    {
      title: "Ordini Attivi",
      value: "Prossimamente",
      icon: Clock,
      color: "text-gold"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border hover:border-gold/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;