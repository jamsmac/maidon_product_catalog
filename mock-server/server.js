const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Add custom routes
server.use(jsonServer.bodyParser);

// Custom auth endpoint
server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@mydon.uz' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token-12345',
      user: {
        id: 1,
        email: email,
        name: 'Администратор'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Неверный email или пароль'
    });
  }
});

// Custom parts search endpoint
server.get('/parts/search', (req, res) => {
  const { vin } = req.query;
  const db = router.db;

  // Mock parts search logic
  const parts = db.get('parts').value();

  if (vin) {
    // Simple VIN matching logic
    const matchingParts = parts.filter(part =>
      part.compatibility.some(model => model.toLowerCase().includes(vin.toLowerCase().slice(0, 3)))
    );

    res.json(matchingParts);
  } else {
    res.json(parts);
  }
});

server.use(middlewares);
server.use('/api', router);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Mock API server running on http://localhost:${port}`);
  console.log(`API endpoints available at http://localhost:${port}/api/*`);
});
