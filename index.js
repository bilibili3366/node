let httpProxy = require('http-proxy')
let https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
    key: fs.readFileSync(path.join(__dirname, './key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './cert.pem')),
};

// 这是我们配置的域名，我们可以访问这些域名，拿到对应的结果
let hosts = {
    'api.zeroapi.dns.navy': 'http://data.zero777.dns.army',
    // 'as.com': 'https://localhost:8081',// 也不支持https
}

// 创建代理服务器
let proxy = httpProxy.createProxyServer()

let server = https.createServer(options, (req, res) => {
    // 拿到host 访问对应的服务器
    let host = req.headers['host'].split(':')[0]
    console.log(666.789, host, hosts[host])
    proxy.web(req, res, {
        target: hosts[host] || 'http://data.zero777.dns.army'
    })
})

server.listen(3001)
// server启动成功
server.on('listening', () => {
    console.log('https启动完成')
})

// 关闭HTTPS服务器
server.on('close', () => {
    console.log('服务器关闭')
})
