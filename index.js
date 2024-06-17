import { error, log } from "node:console";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { pool } from "workerpool";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;

const fileReadPool = pool(join(__dirname, "file_read-workers.js"));

const server = createServer(async (req, res) => {
  res.writeHead(200, "Content-type: text/html");
  if (req.url === "/") {
    // read file and send it
    
    try {
      const result = await fileReadPool.exec('html', ['index.html']);
      res.end(result);
    } catch (error) {
      error(err);
      res.end()
    } finally {
      fileReadPool.terminate(); 
    }

  }else if (req.url === "/about") {
    // read file and send it
    
    try {
      const result = await fileReadPool.exec('html', ['about.html']);
      res.end(result);
    } catch (error) {
      error(err);
      res.end()
    } finally {
      fileReadPool.terminate(); 
    }

  }
});

server.listen(port, () => log(`server running port ${port}...`));
