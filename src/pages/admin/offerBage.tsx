import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, PlusCircle } from "lucide-react";
import axios from "axios";

type OfferBadge = {
  _id: string;
  title: string;
  description?: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
};

const OfferBadgesManager = () => {
  const [badges, setBadges] = useState<OfferBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discount: "",
    expiryDate: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchBadges = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}api/offer-badges`);
      setBadges(res.data);
    } catch (err) {
      console.error("Errore nel caricamento dei badge:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URI}api/offer-badges/${id}`);
      setBadges((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Errore nell'eliminazione del badge:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.discount || !form.expiryDate) return;
    setSubmitting(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}api/offer-badges`, {
        title: form.title,
        description: form.description,
        discount: Number(form.discount),
        expiryDate: form.expiryDate
      });
      setBadges((prev) => [res.data, ...prev]);
      setForm({ title: "", description: "", discount: "", expiryDate: "" });
    } catch (err) {
      console.error("Errore nell'aggiunta del badge:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Offer Badge Form */}
      <Card>
        <CardHeader>
          <CardTitle>Aggiungi Nuovo Badge Offerta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Titolo"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Input
              placeholder="Descrizione"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              placeholder="Sconto %"
              type="number"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              required
            />
            <Input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              required
            />
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting}>
                <PlusCircle className="w-4 h-4 mr-2" />
                {submitting ? "Aggiungendo..." : "Aggiungi Badge"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List of Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Tutti i Badge Offerta</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Caricamento badge...</p>
          ) : badges.length === 0 ? (
            <p className="text-muted-foreground">Nessun badge trovato.</p>
          ) : (
            <div className="grid gap-4">
              {badges.map((badge) => (
                <div
                  key={badge._id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div>
                    <h3 className="font-bold text-lg">{badge.title}</h3>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{badge.discount}% SCONTO</Badge>
                      <Badge variant="outline">
                        Scade: {new Date(badge.expiryDate).toLocaleDateString("it-IT")}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(badge._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferBadgesManager;