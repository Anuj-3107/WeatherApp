
//packages
const http=require("http");
const fs=require("fs");
var requests=require("requests");

//reading html
const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal) => {
    let temperature=tempVal.replace("{%tempval%}",(orgVal.main.temp-273.15).toFixed(2));
    temperature=temperature.replace("{%mintemp%}",(orgVal.main.temp_min-273.15).toFixed(2));
    temperature=temperature.replace("{%maxtemp%}",(orgVal.main.temp_max-273.15).toFixed(2));
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}

const server=http.createServer((req,res)=>{
if(req.url=="/"){
    requests("http://api.openweathermap.org/data/2.5/weather?q=Yavatmal&appid=c6f1af7d05cbe51e56fb95f4fb96e8bf")
.on('data', (chunk)=> {
  const obdata=JSON.parse(chunk);
  const arrdata=[obdata];
//  console.log(arrdata[0].main.temp);
const realData=arrdata.map((val) => replaceVal(homeFile,val)).join("");
res.write(realData); 
})
.on('end', (err)=> {
  if (err) return console.log('connection closed due to errors', err);
  res.end();
});
}
});

server.listen(8000,"127.0.0.1");