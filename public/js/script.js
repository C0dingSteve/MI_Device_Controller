//Popover Initialization
let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})
// console.log(popoverList);
// ++++++++++++++++++++++++++++++++ Utility Functions +++++++++++++++++++++++++++++++++++

//Color Picker

let _color;

$('#yeelight-cp')
.colorpicker({
    inline: true,
    container: true,
    extensions: [
    {
        name: 'swatches',
        options: {
        colors: {
            'tetrad1': '#000',
            'tetrad2': '#000',
            'tetrad3': '#000',
            'tetrad4': '#000'
        },
        namesAsValues: false
        }
    }
    ]
})
.on('colorpickerChange colorpickerCreate', function (e) {

    if(typeof(e.value) === 'string') _color = e.value;
    else _color = e.value.toHexString();

    var colors = e.color.generate('tetrad');

    colors.forEach(function (color, i) {
    var colorStr = color.string(),
        swatch = e.colorpicker.picker
            .find('.colorpicker-swatch[data-name="tetrad' + (i + 1) + '"]');

    swatch
        .attr('data-value', colorStr)
        .attr('title', colorStr)
        .find('> i')
        .css('background-color', colorStr);
    });
});

const popoverUpdate = (_did) => {
     $.ajax({
        url: '/updatePopover',
        method: 'post',
        cache: false,
        data:{
            did: _did,
        },
        success: res => {
            const popover = $('#card-'+_did+' > .img-div > .pop-over');
            //const data = `Model : ${res['model']}<br/>Status: ${res['model']}<br/>Region: ${res['region']}<br/>Info  : ${res['desc']}`;
            },
    });
}

// ++++++++++++++++++++++++++++++++ Air Purifier Commands  +++++++++++++++++++++++++++++++++++

// Toggle Air Purifier

$('.toggler').on('click', event => {
    console.time('toggle');
    event.preventDefault();
    const _did = event.target.id.split('-')[1]; //Device id from button id
    $.ajax({
        url: '/click',
        method: 'post',
        data:{
            did: _did,
        },
        success: () => {
            console.timeEnd('toggle');
            popoverUpdate(_did);
        },
    });
})

//Change Air Purifier mode

function changeMode(_mode, _did){
    $.ajax({
        url: '/changeMode',
        method: 'post',
        data:{
            mode: _mode,
            did: _did,
        },
        success: () => popoverUpdate(_did),
    });
}

$('.device-card').on('click', event => {
    event.preventDefault();
    
    if(event.target.classList.contains('air-purifier-mode'))
    {
        const mode = event.target.id; //Auto, Silent/Night, Manual/Favorite 
        const did = event.currentTarget.id.split('-')[1]; //Gets the id of the card, same as device id
        changeMode(mode, did);
    }
});

// ++++++++++++++++++++++++++++++++ Yeelight Commands  +++++++++++++++++++++++++++++++++++

function activateLights(_mode)
{
    console.log(_mode);
    const _model = 'yeelink.light.strip1';
    $.ajax({
        url: '/changeLight',
        method: 'post',
        data:{
            color: _color,
            model: _model,
            mode: _mode,
        },
        success: res => console.log('success => ', res),
    });
}

$('#yeelight').on('mouseup', e => {
    if($(e.target).attr('class') === 'colorpicker-guide') {activateLights('standard');}
    else if($(e.target).attr('id') === 'yeelight-auto') {activateLights('auto');}
});