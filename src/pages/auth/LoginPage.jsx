import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de login aqui
    console.log("Login:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{backgroundColor: '#BCF0FA'}}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background: 'linear-gradient(135deg, #0EA8C5 0%, #8D36BA 100%)'}}>
            <span className="text-white font-bold text-2xl">FP</span>
          </div>
          <h1 className="text-2xl font-bold" style={{color: '#0A7083'}}>FinPlanner V2</h1>
          <p style={{color: '#0A7083'}}>Entre na sua conta</p>
        </div>

        {/* Formulário */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#0A7083'}}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#0EA8C5'}} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{borderColor: '#0EA8C5', focusRingColor: '#0EA8C5'}}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#0A7083'}}>
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{color: '#0EA8C5'}} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{borderColor: '#0EA8C5'}}
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{color: '#0EA8C5'}}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 border-gray-300 rounded focus:ring-2" style={{accentColor: '#0EA8C5'}} />
                <span className="ml-2 text-sm" style={{color: '#0A7083'}}>Lembrar de mim</span>
              </label>
              <a href="#" className="text-sm transition-colors" style={{color: '#0EA8C5'}}>
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="w-full text-white py-3 rounded-xl transition-all duration-200 font-semibold"
              style={{background: 'linear-gradient(135deg, #0EA8C5 0%, #8D36BA 100%)'}}
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{color: '#0A7083'}}>
              Não tem uma conta?{" "}
              <Link to="/register" className="font-semibold transition-colors" style={{color: '#0EA8C5'}}>
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}