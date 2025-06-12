const http = require('http');
const fs = require('fs');
const url = require('url');
const path = './items.json';
const Port = 3000
// Helper: read items from file
function readItems() {
  if (!fs.existsSync(path)) return [];
  const data = fs.readFileSync(path);
  return JSON.parse(data);
}

// Helper: write items to file
function writeItems(items) {
  fs.writeFileSync(path, JSON.stringify(items, null, 2));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const id = parsedUrl.query.id;
  let body = '';

  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    res.setHeader('Content-Type', 'application/json');
    const items = readItems();

    // CREATE item
    if (req.method === 'POST' && parsedUrl.pathname === '/items') {
      const { name, price, size } = JSON.parse(body);
      if (!name || !price || !['small', 'medium', 'large'].includes(size)) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ message: 'Invalid input' }));
      }
      const newItem = { id: Date.now().toString(), name, price, size };
      items.push(newItem);
      writeItems(items);
      return res.end(JSON.stringify({ message: 'Item created', item: newItem }));
    }

   // GET all items
    if (req.method === 'GET' && parsedUrl.pathname === '/items') {
      return res.end(JSON.stringify(items));
      
    }

    // GET one item
    if (req.method === 'GET' && parsedUrl.pathname === '/item') {
      const item = items.find(i => i.id === id);
      if (!item) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: 'Item not found' }));
      }
      return res.end(JSON.stringify(item));
    }

    // UPDATE item
    if (req.method === 'PUT' && parsedUrl.pathname === '/item') {
      const index = items.findIndex(i => i.id === id);
      if (index === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: 'Item not found' }));
      }
      const { name, price, size } = JSON.parse(body);
      if (name) items[index].name = name;
      if (price) items[index].price = price;
      if (['small', 'medium', 'large'].includes(size)) items[index].size = size;
      writeItems(items);
      return res.end(JSON.stringify({ message: 'Item updated', item: items[index] }));
    }

    // DELETE item
    if (req.method === 'DELETE' && parsedUrl.pathname === '/item') {
      const index = items.findIndex(i => i.id === id);
      if (index === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: 'Item not found' }));
      }
      const deleted = items.splice(index, 1);
      writeItems(items);
      return res.end(JSON.stringify({ message: 'Item deleted', item: deleted[0] }));
    }

    // Fallback
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  });
});

server.listen(3000, () => {
  console.log(` Server running on ${Port}`);
});
