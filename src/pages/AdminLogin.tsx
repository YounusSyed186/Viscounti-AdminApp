import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock login - in real app this would validate against backend
    setTimeout(() => {
      if (email === 'admin@visconti.com' && password === 'admin123') {
        localStorage.setItem('adminToken', 'mock-admin-token');
        navigate('/admin/dashboard');
      } else {
        alert('Credenziali non valide. Usa admin@visconti.com / admin123');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 text-7xl">🍕</div>
        <div className="absolute bottom-1/3 right-1/4 text-6xl">🥙</div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-sm border-border">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <CardTitle className="text-2xl font-serif text-gold">
            Accesso Amministratore
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Pannello di Controllo Pizzeria Visconti
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@visconti.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Inserisci password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gold text-black hover:bg-gold-dark"
              disabled={loading}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Credenziali demo:<br />
              <span className="font-mono">admin@visconti.com</span><br />
              <span className="font-mono">admin123</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;