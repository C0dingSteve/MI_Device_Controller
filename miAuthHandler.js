const mihome = require('node-mihome');
const deviceManager = require(__dirname+'/deviceManager.js');

let deviceInfoList = []; //cannot make const because in line 12 recieves a new array
exports.deviceInfoList = () => deviceInfoList;

exports.login = async(email, password) => {
  
  await mihome.miCloudProtocol.login(email, password);
  const options = { country: 'cn' };
  deviceInfoList = await mihome.miCloudProtocol.getDevices(null, options);

  const promises = [];

  deviceInfoList.forEach( (deviceInfo, index) => {
    deviceInfo['region'] = 'cn';
    promises.push(deviceManager.setDeviceImageURI(deviceInfoList, index));
  });
  
  await Promise.all(promises);
}

exports.setDeviceInfoList = async(old_device) => {
  const options = { country: 'cn'};
  
  let new_device = await mihome.miCloudProtocol.getDevices([old_device['did']], options);

  exports.deviceInfoList().forEach((temp_device, i) => {
    if(temp_device['did'] === old_device['did'])
    {
      new_device[0]['region'] = 'cn';
      new_device[0]['imgURI'] = old_device['imgURI'];
      exports.deviceInfoList()[i] = new_device[0];
    }
  });
  return new_device[0];
}

exports.logout = () =>{
  mihome.miCloudProtocol.logout();
}