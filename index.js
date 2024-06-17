var http = require('http');
var httpProxy = require('http-proxy');

// 新建一个代理 Proxy Server 对象
var proxy = httpProxy.createProxyServer({});

// 捕获异常
proxy.on('error', function (err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
});

// 监听代理请求的响应事件
proxy.on('proxyRes', function (proxyRes, req, res) {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
});

// 创建 HTTP 服务器
var server = http.createServer(function (req, res) {
  var host = req.headers.host;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log("client ip:" + ip + ", host:" + host);

  // 添加日志以检查请求的 URL 和目标服务器的响应状态
  console.log(`Request URL: ${req.url}`);

  // 明确的路由条件
  if (host === 'api.zeroapi.dns.navy') { // 确保替换为你的实际域名
    console.log(`Proxying request for ${host} to http://api.7779888.shop`);
    proxy.web(req, res, { target: 'http://api.7779888.shop' }, function (e) {
      if (e) {
        console.error('Proxy error:', e);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Proxying failed.');
      }
    });
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('Welcome to my server!');
  }
});

console.log("listening on port 80");
server.listen(80);
