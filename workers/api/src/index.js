/**
 * Cloudflare Worker API
 * This worker handles API requests and connects to D1 database
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      // Route handling
      if (path === '/api/health') {
        return handleHealth(env, corsHeaders);
      } else if (path.startsWith('/api/users')) {
        return handleUsers(request, env, corsHeaders);
      } else if (path.startsWith('/api/posts')) {
        return handlePosts(request, env, corsHeaders);
      } else {
        return new Response('Not Found', {
          status: 404,
          headers: corsHeaders,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

async function handleHealth(env, corsHeaders) {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: env.DB ? 'connected' : 'not configured',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  );
}

async function handleUsers(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    // Get all users
    const { results } = await env.DB.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } else if (method === 'POST') {
    // Create new user
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Email and name are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    const result = await env.DB.prepare(
      'INSERT INTO users (email, name) VALUES (?, ?) RETURNING *'
    ).bind(email, name).first();

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  return new Response('Method Not Allowed', {
    status: 405,
    headers: corsHeaders,
  });
}

async function handlePosts(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    // Get all posts with user information
    const { results } = await env.DB.prepare(`
      SELECT p.*, u.name as user_name, u.email as user_email 
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `).all();
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } else if (method === 'POST') {
    // Create new post
    const body = await request.json();
    const { title, content, user_id } = body;

    if (!title || !user_id) {
      return new Response(JSON.stringify({ error: 'Title and user_id are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    const result = await env.DB.prepare(
      'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?) RETURNING *'
    ).bind(title, content, user_id).first();

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }

  return new Response('Method Not Allowed', {
    status: 405,
    headers: corsHeaders,
  });
}