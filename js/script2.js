$(function() {
    var len;
    var i;
    var coluna = 0;
    var linha = 0;

    for (i = 0, len = 100; i < len; i++) {
        $('#tabuleiro').append('<div class="cel"><span data-principal="0" data-coord="C_'+linha+'_'+coluna+'" class="dot"></span></div>');

        coluna++;
        
        if(coluna === 10){
            coluna = 0;
            linha++;
        }
    } 

    fade();
});

function fade() {
    var time = 5;
    var cores = ['#8CBEFF', '#EF5D42', '#8CEB94', '#E6DB21', '#9C5DB5'];
    var cor = '';

    $('.dot').each(function(e, f) {
        setTimeout(function() {
            cor = corAleatoria(cores);

            $(f).css({
                'height': '15px',
                'width': '15px',
                'background-color': cor,
                'transform': 'translateY(0px) translateX(0px)'
            });
        }, time);

        time += 5;
    });
}

var setCoords = function (element) {
    var data_coord = element.attr('data-coord');

    var linha = data_coord[2]
    var coluna = data_coord[4];

    return [linha, coluna];
}

function transCel (element) {
    var cor = element.children('.dot').css('background-color');
    
    element.css('background-color', cor);

    element.bind('transitionend', function() {
        element.css('background-color', '');
    });
}

function corAleatoria(arrayCores) {
    var cores = arrayCores;
    return cores[Math.floor(Math.random() * cores.length)];
}

function calculateDistance(elem, mouseX, mouseY) {
    return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left + (elem.width() / 2)), 2) 
         + Math.pow(mouseY - (elem.offset().top + (elem.height() / 2)), 2)));
}

function calculateDegree(e, celula){
    var relX = e.pageX - celula.offset().left - 15;
    var relY = e.pageY - celula.offset().top - 10;

    var X = e.pageX;
    var Y = e.pageY;

    var distanceMouse = calculateDistance(celula, X, Y);

    var center_x = (celula.offset().left) + (celula.width() / 2);
    var center_y = (celula.offset().top) + (celula.height() / 2);

    var radians = Math.atan2(X - center_x, Y - center_y);
    var degree = (radians * (180 / Math.PI) * -1) + 90;

    return [degree, X, Y, distanceMouse];
}


$(document).on('mousedown', '.dot', function(event) {
    event.preventDefault();
    transCel($(this).parent('.cel'));

    var dotCor = $(this).css('background-color');
    //---------Coords-----------

    coords = setCoords($(this));

    var linha = coords[0];
    var coluna = coords[1];

    $(this).html('<span class="line"></span>');
    
    var celula = $(this);

    $(document).on('mousemove', function(e) {
        e.preventDefault();

        var position_line = calculateDegree(e, celula);

        var degree = position_line[0];
        var X = position_line[1];
        var Y = position_line[2];
        var distanceMouse = position_line[3];

        console.log(distanceMouse);

        $(this).find('.line').css({
            'width': distanceMouse+'px',
            'background-color': dotCor,
            'transform': 'rotate(' + degree + 'deg)'
        });
    });

    // Pega o proximo dot na linha:
    // $(this).parent('.cel').next('.cel').children('.dot').css('background-color', dotCor);

}).on('mouseup', function(event) {
    $('.dot').html('');
    $(document).off('mousemove');
});