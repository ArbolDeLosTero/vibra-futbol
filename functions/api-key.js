// functions/api-key.js
// Proxy seguro para llamar a APIs de fútbol (Highlightly y SportScore)

export async function onRequest(context) {
  // Obtener la clave secreta desde las variables de entorno de Cloudflare
  const HIGHLIGHTLY_API_KEY = context.env.HIGHLIGHTLY_API_KEY;

  // Si no está configurada, devolver error
  if (!HIGHLIGHTLY_API_KEY) {
    return new Response(JSON.stringify({ error: 'API Key no configurada en Cloudflare' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Obtener parámetros de la URL de la petición
  const url = new URL(context.request.url);
  const endpoint = url.searchParams.get('endpoint');
  const matchId = url.searchParams.get('matchId');

  // Construir la URL de la API externa según el endpoint solicitado
  let apiUrl;
  if (endpoint === 'highlightly') {
    apiUrl = `https://api.highlightly.com/v1/matches/${matchId}?api_key=${HIGHLIGHTLY_API_KEY}`;
  } else if (endpoint === 'sportscore') {
    apiUrl = `https://sportscore.io/api/v1/events/${matchId}`;
  } else {
    return new Response(JSON.stringify({ error: 'Endpoint no soportado. Usa "highlightly" o "sportscore".' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Realizar la petición a la API real
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Devolver los datos al frontend
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al consultar la API externa', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
