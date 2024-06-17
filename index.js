var http = require('http');
var httpProxy = require('http-proxy');

// 新建一个代理 Proxy Server 对象
var proxy = httpProxy.createProxyServer({});

// 捕获异常
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
});

// 另外新建一个 HTTP 80 端口的服务器，也就是常规 Node 创建 HTTP 服务器的方法。
// 在每次请求中，调用 proxy.web(req, res config) 方法进行请求分发
var server = http.createServer(function (req, res) {
  // 在这里可以自定义你的路由分发
  var host = req.headers.host;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("client ip:" + ip + ", host:" + host);

  // 添加日志以检查请求的 URL 和目标服务器的响应状态
  console.log(`Request URL: ${req.url}`);

  switch (host) {
    case 'api.zeroapi.dns.navy': // 替换为你的实际域名
      proxy.web(req, res, { target: 'https://api.7779888.shop' });
      break;
    
    default:
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end('Welcome to my server!');
      break;
  }
});

console.log("listening on port 80");
server.listen(80);
