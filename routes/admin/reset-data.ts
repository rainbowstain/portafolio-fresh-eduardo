import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req) {
    // Verificar sesión
    const session = req.headers.get("cookie")?.split("admin_session=")[1]?.split(";")[0];
    
    if (!session) {
      return new Response("", {
        status: 302,
        headers: { Location: "/admin/login" }
      });
    }
    
    try {
      // Eliminar todos los archivos de datos
      const dataDir = await Deno.stat("./data").catch(() => null);
      let filesRemoved = 0;
      
      if (dataDir && dataDir.isDirectory) {
        // Listar todos los archivos en el directorio
        for await (const entry of Deno.readDir("./data")) {
          if (entry.name.startsWith("analytics_")) {
            try {
              await Deno.remove(`./data/${entry.name}`);
              console.log(`Archivo eliminado: ${entry.name}`);
              filesRemoved++;
            } catch (err) {
              console.error(`Error al eliminar ${entry.name}:`, err);
            }
          }
        }
        
        // Verificar si quedan archivos
        let remainingFiles = 0;
        for await (const entry of Deno.readDir("./data")) {
          if (entry.name.startsWith("analytics_")) {
            remainingFiles++;
          }
        }
        
        if (remainingFiles > 0) {
          throw new Error(`No se pudieron eliminar todos los archivos. Quedan ${remainingFiles} archivos.`);
        }
        
        console.log(`Datos reiniciados correctamente. Se eliminaron ${filesRemoved} archivos.`);
      } else {
        // Si no existe el directorio, crearlo
        await Deno.mkdir("./data", { recursive: true });
        console.log("Directorio de datos creado.");
      }
      
      // Redirigir de vuelta al panel de analíticas
      return new Response("", {
        status: 302,
        headers: { Location: "/admin/analytics" }
      });
    } catch (error) {
      console.error("Error al reiniciar datos:", error);
      return new Response(`Error al reiniciar los datos: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
    }
  }
}; 