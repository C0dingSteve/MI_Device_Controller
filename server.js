const express = require('express');
const miAuthHandler = require(__dirname+'/miAuthHandler.js');
const deviceManager = require(__dirname+'/deviceManager.js');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req,res)=>{
  res.sendFile(__dirname+'/index.html');
})

app.post('/', async(req, res)=>{
  console.profile();
  const email = req.body.email;
  const pass = req.body.password;
  //returns linked devices
  miAuthHandler.login(email, pass)
  .then(() => res.redirect('/dashboard'))
  .catch(err => {
    console.log(err);
    res.redirect('/');
  });
});

app.get('/dashboard', (req, res)=>{
  res.render('dashboard', {_deviceList: miAuthHandler.deviceInfoList()});
})

app.post('/logout', (req, res)=>{
  try {
    miAuthHandler.logout();
    res.redirect('/');
  }
  catch(err){
    console.log(err);
    res.redirect('/dashboard');
  }
})

app.post('/click', (req, res) => {
  const device = miAuthHandler.deviceInfoList().find(item => item['did'] === req.body.did);
  deviceManager.toggle(device);
  res.send('Request recieved');
})

app.post('/changeMode', async(req, res) => {
  console.log(req.body);
  const device = miAuthHandler.deviceInfoList().find(item => item['did'] === req.body.did);
  await deviceManager.changeMode(device, req.body.mode);
  res.send('Request recieved');
})

app.post('/changeLight', async(req, res) => {
  const device = miAuthHandler.deviceInfoList().find(item => item['model'] === req.body.model);
  await deviceManager.changeLight(device, req.body.color, req.body.mode);
  res.send('Request recieved');
})

app.post('/updatePopover', async(req, res) => {
  // console.log(req);
  const device = miAuthHandler.deviceInfoList().find(item => item['did'] === req.body.did);
  const new_device = await miAuthHandler.setDeviceInfoList(device);
  res.send(new_device);
})

app.listen('3000', ()=> {
  console.log('connected to server 8000')
});