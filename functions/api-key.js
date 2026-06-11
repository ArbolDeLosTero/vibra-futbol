export async function onRequest(context) {
  // Obtener la clave secreta desde las variables de entorno
  const HIGHLIGHTLY_API_KEY = context.env.HIGHLIGHTLY_API_KEY;

  if (!HIGHLIGHTLY_API_KEY) {
    return new Response(JSON.stringify({ error: 'API Key no configurada' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(context.request.url);
  const endpoint = url.searchParams.get('endpoint');
  const matchId = url.searchParams.get('matchId');

  if (!endpoint || !matchId) {
    return new Response(JSON.stringify({ error: 'Faltan parámetros: endpoint y matchId son requeridos' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let apiUrl;
  if (endpoint === 'highlightly') {
    apiUrl = `https://api.highlightly.com/v1/matches/${matchId}?api_key=${HIGHLIGHTLY_API_KEY}`;
  } else if (endpoint === 'sportscore') {
    apiUrl = `https://sportscore.io/api/v1/events/${matchId}`;
  } else {
    return new Response(JSON.stringify({ error: 'Endpoint no soportado' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
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
