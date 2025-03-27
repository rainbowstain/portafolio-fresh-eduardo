// Página de login para el panel de administración
import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

interface LoginData {
  error?: string;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const formData = await req.formData();
    const password = formData.get("password");
    
    // Claves válidas (en producción, usar variables de entorno)
    const validPasswords = [
      Deno.env.get("ADMIN_PASSWORD") || "sobremia2024",
      "sobremia_admin"
    ];
    
    if (!password || !validPasswords.includes(password.toString())) {
      return ctx.render({ error: "Contraseña incorrecta" });
    }
    
    // Crear sesión
    const session = crypto.randomUUID();
    
    // Redirigir al dashboard con la sesión
    const response = new Response("", {
      status: 302,
      headers: { Location: "/admin/analytics" }
    });
    
    // Guardar la sesión en una cookie segura
    response.headers.set(
      "Set-Cookie",
      `admin_session=${session}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
    );
    
    return response;
  }
};

export default function LoginPage({ data }: PageProps<LoginData>) {
  return (
    <>
      <Head>
        <title>Login - Panel de Administración SobremIA</title>
        <meta name="description" content="Acceso al panel de administración" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
              <p className="text-gray-400">Ingresa tu contraseña para continuar</p>
            </div>
            
            <form method="POST" className="space-y-6">
              {data?.error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                  {data.error}
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
} 