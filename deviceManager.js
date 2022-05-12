const miio = require('miio');

exports.getDevice = async(device) =>{
    // 192.168.0.103 is AI speaker
    if(device['localip']==='' || device['token'] === '' || device['localip'] === '192.168.0.103') return undefined;
    return await miio.device({ address: device['localip'], token: device['token'] });
}

exports.setDeviceImageURI = async(deviceInfoList, index) => 
{ 
    let uri = '/images/unknown_device.jpg';
    const device = await exports.getDevice(deviceInfoList[index])
    if(device !== undefined)
    {
        if(device.matches('type:miio:air-purifier')){
            uri = '/images/air_purifier.jpg';
        }
        else if(device.matches('type:miio:gateway')){
            uri = '/images/gateway.jpg';
        }
        else if(device.matches('type:miio:yeelight')){
            uri = '/images/yeelight_led_strip.jpg';
        }
        else if(deviceInfoList[index]['model'].split('.').find(item => item === 'fan') === 'fan'){
            
            uri = '/images/xiaomi_fan.jpg';
        }
        else if(deviceInfoList[index]['model'].split('.').find(item => item === 'vacuum') === 'vacuum'){
            
            uri = '/images/roborock_g10.jpg';
        }
    }
    deviceInfoList[index]['imgURI'] = uri;
}

// General Device Options

exports.toggle = async(_device) => {
    let device = await exports.getDevice(_device);
    if(device === undefined) return;

    device.togglePower()
    .then(on => console.log('Power is now', device.power()))
    .catch(err => console.log(err));
}

// Air Purifier Options

exports.changeMode = async(_device, _mode) => {
    let device = await exports.getDevice(_device);

    device.setMode(_mode)
    .then(newMode => console.log('Mode is changed to ', newMode))
    .catch(err => console.log(err));
}

let intervalID;

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

exports.changeLight = async(_device, _color, _mode) => {
    if(intervalID !== undefined) clearInterval(intervalID);

    let device = await exports.getDevice(_device);
    if(_mode === 'standard') device.color(_color, 1);
    else if (_mode === 'auto')
    {
        intervalID = setInterval(() => device.color(getRandomColor(), 1), 500);
    }
}
