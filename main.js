const { default: axios } = require("axios");
const fs = require("fs");

const http = require("http");

const url_proveedores = "/api/proveedores";
const url_clientes = "/api/clientes";

http.createServer((req,res)=>{
    try{
        if(req.url === url_proveedores ){
            axios.get("https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json")
                .then(json=>{
                    let {data} = json
                    writeHtml(data,"proveedores");
                }).then(()=>{
                    readHtml(res,"proveedores");
                });
        }else if(req.url === url_clientes){
            axios.get("https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json")
            .then(json=>{
                let {data} = json
                writeHtml(data,"clientes");
            }).then(()=>{
                readHtml(res,"clientes");
            });
        }
    
    }catch(err){
        console.log(err);
    }
}).listen(8081);
    

function writeHtml(data_json, archivo){
    fs.writeFile(archivo+".html",
    `<!DOCTYPE html>
    <html>
    <head>
    <title>Page Title</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    </head>
    <body>
    <h1> Listado de `+ archivo + ` </h1>
    <table class="table table-striped">
    <thead>
        <tr>
        <th scope="col">ID</th>
        <th scope="col">Nombre</th>
        <th scope="col">Contacto</th>
        </tr>
    </thead>
    <tbody>
    `
    +
    addTable(data_json,archivo)
    +
    `
    </tbody>
    </table>    
    </body>
    </html>`
    ,"utf-8",()=>{
        console.log("Escritura finalizada");
    }); 
}

function readHtml(res,archivo){
    fs.readFile(archivo+ ".html",(err,data)=>{
        if(err){
            throw err;
        }else{
            res.writeHead(200,{
                'Content-Type':'text/html'
            })
            res.write(data);
        }
    });
}

function addTable(data_json,archivo){
    let body = ""
    
    for(let i =0; i<data_json.length ; i++){
        if(archivo==="proveedores"){
            let {idproveedor,nombrecompania,nombrecontacto} = data_json[i];
            body += `<tr>
                 <td>`+ idproveedor +`</td>
                 <td>`+ nombrecompania + `</td>
                 <td>`+ nombrecontacto + `</td>
                 </tr>
                 `
        }else{
            let {idCliente,NombreCompania,NombreContacto} = data_json[i];
            body += `<tr>
            <td>`+ idCliente +`</td>
            <td>`+ NombreCompania + `</td>
            <td>`+ NombreContacto + `</td>
            </tr>
            `     
        }       
    }
    return body
}
