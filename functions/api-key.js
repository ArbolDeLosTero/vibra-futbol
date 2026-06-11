export async function onRequest(context) {
  // Verificar si la variable existe
  const apiKey = context.env.HIGHLIGHTLY_API_KEY;
  
  // Devolver información de depuración
  return new Response(JSON.stringify({
    tiene_clave: !!apiKey,
    longitud_clave: apiKey ? apiKey.length : 0,
    primeras_letras: apiKey ? apiKey.substring(0, 5) : 'ninguna',
    todas_las_variables: Object.keys(context.env || {})
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
