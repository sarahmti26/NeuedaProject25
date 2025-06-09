# ESG Portfolio Tracker

## Overview
The ESG Portfolio Tracker is a web application designed to help users manage their investments with insights into Environmental, Social, and Governance (ESG) factors. This application allows users to enter stock tickers and their respective allocations, view their portfolio, and receive alerts regarding any controversies related to their investments.

## Project Structure
```
esg-portfolio-tracker
├── public
│   ├── index.html        # HTML structure for the application
│   └── styles.css       # CSS styles for the application
├── src
│   └── app.js           # JavaScript functionality for the application
├── package.json          # npm configuration file
└── README.md             # Documentation for the project
```

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd esg-portfolio-tracker
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To test the application, you can open the `public/index.html` file directly in a web browser. For a better experience, it is recommended to set up a local server. You can use tools like Live Server or serve the files using Node.js.

#### Using Live Server
1. Install Live Server extension in your code editor.
2. Right-click on `public/index.html` and select "Open with Live Server".

#### Using Node.js
1. Create a simple server using Node.js:
   ```javascript
   const http = require('http');
   const fs = require('fs');
   const path = require('path');

   const server = http.createServer((req, res) => {
       let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
       const extname = path.extname(filePath);
       let contentType = 'text/html';

       switch (extname) {
           case '.js':
               contentType = 'text/javascript';
               break;
           case '.css':
               contentType = 'text/css';
               break;
           case '.json':
               contentType = 'application/json';
               break;
           case '.png':
               contentType = 'image/png';
               break;
           case '.jpg':
               contentType = 'image/jpg';
               break;
           case '.gif':
               contentType = 'image/gif';
               break;
           case '.svg':
               contentType = 'image/svg+xml';
               break;
           case '.wav':
               contentType = 'audio/wav';
               break;
           case '.mp4':
               contentType = 'video/mp4';
               break;
           default:
               contentType = 'text/html';
       }

       fs.readFile(filePath, (error, content) => {
           if (error) {
               if (error.code == 'ENOENT') {
                   res.writeHead(404, { 'Content-Type': 'text/html' });
                   res.end('<h1>404 Not Found</h1>', 'utf-8');
               } else {
                   res.writeHead(500);
                   res.end('Sorry, there was an error: ' + error.code + ' ..\n');
               }
           } else {
               res.writeHead(200, { 'Content-Type': contentType });
               res.end(content, 'utf-8');
           }
       });
   });

   const PORT = process.env.PORT || 3000;
   server.listen(PORT, () => {
       console.log(`Server running at http://localhost:${PORT}/`);
   });
   ```
2. Run the server:
   ```
   node server.js
   ```
3. Open your browser and navigate to `http://localhost:3000`.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.