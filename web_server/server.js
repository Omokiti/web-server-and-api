const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;


const serveFile = ( res,studentFilePath)=>{
    fs.readFile(studentFilePath, ( err,content) =>{

        if(err){
            res.writeHead(500);
            res.end('Loading Error');
           
        } else{
            res.writeHead(200,{
            'Content-Type':'text/html'
            });
            res.end(content);
        }
       
    })

}
const server = http.createServer((req,res)=>{

    if(req.url ==='/' || req.url ==='/index')   {
   serveFile(res, path.join(__dirname,'index.html'));
   
    
} else{
    res.writeHead(404,{
        'Content-Type':'text/html'
    })
    res.end('<h1> 404 - Page Not Found</h1>')
}


})

server.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})


