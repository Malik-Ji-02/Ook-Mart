import { getAllShops, getShopById, getAllProducts, createOrder, getOrders } from './db.js';
import url from 'url';

export function databaseMiddleware(req, res, next) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (!pathname.startsWith('/api/')) {
    return next();
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const { lat, lng, category, search } = parsedUrl.query;

  try {
    if (pathname === '/api/shops' && req.method === 'GET') {
      const userLat = lat ? parseFloat(lat) : null;
      const userLng = lng ? parseFloat(lng) : null;
      const shops = getAllShops(userLat, userLng);
      return res.end(JSON.stringify({ success: true, shops }));
    }

    if (pathname.startsWith('/api/shops/') && req.method === 'GET') {
      const id = parseInt(pathname.split('/api/shops/')[1]);
      const userLat = lat ? parseFloat(lat) : null;
      const userLng = lng ? parseFloat(lng) : null;
      const shop = getShopById(id, userLat, userLng);
      if (!shop) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ success: false, error: 'Shop not found' }));
      }
      return res.end(JSON.stringify({ success: true, shop }));
    }

    if (pathname === '/api/products' && req.method === 'GET') {
      const products = getAllProducts(category, search);
      return res.end(JSON.stringify({ success: true, products }));
    }

    if (pathname === '/api/orders' && req.method === 'GET') {
      const orders = getOrders();
      return res.end(JSON.stringify({ success: true, orders }));
    }

    if (pathname === '/api/orders' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          const result = createOrder(data);
          return res.end(JSON.stringify(result));
        } catch(e) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return;
    }

    res.statusCode = 404;
    return res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
  } catch(err) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ success: false, error: err.message }));
  }
}
