const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;

//Listen for app to be ready
app.on('ready', function(){
  //Create new window
  mainWindow = new BrowserWindow({});
  //Load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }));
  //Quit app when closed
  mainWindow.on('closed', function() {
    app.quit();
  })
});

//Catch item 
ipcMain.on('schema', function(e, data){
  //data will come as json so we parse
  let item = JSON.parse(data);
  let schema = '';
  let query = 'type Query {\n';
  //let resolver = 'Query: {\n';

  //translating each node into a graphql type
  const renderType = function(node) {
    if(!node) return;

    let props = '';
    for(let x in node.attributes) {
      props += `${x}: ${node.attributes[x]},\n`
    }
    let children = '';
    for(let i = 0; i < node.children.length; i++) {
      children+= `${node.children[i].name.toLowerCase()}: `;
      //node.children[i].arr ? children+= `[${node.children[i].name}],\n` : children+= `${node.children[i].name},\n`
      children+= `[${node.children[i].name}],\n`
      query += `${node.children[i].name.toLowerCase()}(id: ID!): ${node.children[i].name},\n`
    }

    //resolver += `${node.name.toLowerCase()}(obj, args, context, info) {\n}`
    
    schema += `type ${node.name} {\n
      ${props}${children}\n
    };\n\n`;
  }

  
  //run helper function for every root node
  for(let i = 0; i < item.length; i++) {
    renderType(item[i]);
  }
  
  //end query after its finished filling
  query += `}`;

  //add type query to schema after all the other types
  schema += query;

  mainWindow.webContents.send('schema', schema);
});