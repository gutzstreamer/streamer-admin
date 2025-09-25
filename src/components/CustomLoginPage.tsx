import { useState, useRef } from "react";
import { useLogin, useNotify } from "react-admin";
import Turnstile from "react-turnstile";

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const CustomLoginPage = () => {
  const login = useLogin();
  const notify = useNotify();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ref para o widget do Turnstile
  const turnstileWidget = useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      notify("Valide o captcha", { type: "warning" });
      return;
    }
    setLoading(true);
    try {
      await login({ username: email, password, captchaToken });
    } catch (error: any) {
      notify(error?.message || "Login falhou", { type: "error" });

      // 🔄 resetar captcha quando der erro
      if (turnstileWidget.current) {
        turnstileWidget.current.reset();
      }
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 24,
        background: "#222",
        color: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #0008",
      }}
    >
      <h2>Login Admin</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Turnstile
            sitekey={siteKey}
            onVerify={(token) => setCaptchaToken(token)}
            onLoad={(widget) => {
              // guarda o widget para resetar depois
              turnstileWidget.current = widget;
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default CustomLoginPage;
