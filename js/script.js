$(function() {
    var len;
    var i;
    for (i = 1, len = 100; i < len; i++) {
        $('#tabuleiro').append('<div class="cel" data-number="'+i+'"><span data-principal="0" data-cor="" class="dot"></span></div>');
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

            $(f).attr('data-cor', cor);

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

function transCel (element, cor) {
    element.css('background-color', cor);

    element.bind('transitionend', function() {
        element.css('background-color', '');
    });
}

// $(document).on('mouseup', function() {
//     $(this).find('.dot').html('');
//     $('body').off("mousemove");
// });

var isDown = false;
var corDot = []

$(document).on('mousedown', '.cel', function(event) {
    event.preventDefault();

    isDown = true;
    var cor = $(this).find('.dot').css('background-color');
    $(this).find('.dot').attr('data-principal', '1');
    corDot[0] = $(event.target).attr('data-cor');

    transCel($(this), cor);

    $(this).find('.dot').html('<span class="line"></span>');
    var celula = $(this);

    $(document).on('mousemove', function(e) {
        e.preventDefault();

        var calDegree = calculateDegree(e, celula);
        var teste = calculateDistance(celula, calDegree[1], calDegree[2]);

        $(this).find('.line').css({
            'width': teste,
            'background-color': cor,
            'transform': 'rotate(' + calDegree[0] + 'deg)'
        });
    });
}).on('mouseover', '.dot', function (e_over) {
    if(isDown){

        corDot[1] = $(e_over.target).attr('data-cor');
        var dataPricipalOver = $(e_over.target).attr('data-principal');
        console.log(corDot[1]+'-----'+dataPricipalOver);

        if(corDot[0] === corDot[1] && dataPricipalOver === '0'){
            console.log('asdasd');

            console.log($(e_over.target).offset().left - $('.line').parent('.dot').offset().left);

            $('.line').parent('.dot').append('<span class="line"></span>').css('width', '20px');

            transCel($(e_over.target).parent('.cel'), corDot[1]);
        }
    }
}).on('mouseup', function(e_up) {
    isDown = false;

    var line_color = $(this).find('.line').css('background-color');
    var dot_color = $(e_up.target).css('background-color');
    
    $(this).find('.dot').attr('data-principal', '0');
    $(this).find('.dot').html('');
    $('body').off("mousemove");
});

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

    var X = e.pageX - 9;
    var Y = e.pageY - 10;

    var center_x = (celula.offset().left) + (celula.width() / 2);
    var center_y = (celula.offset().top) + (celula.height() / 2);

    var radians = Math.atan2(X - center_x, Y - center_y);
    var degree = (radians * (180 / Math.PI) * -1) + 90;

    return [degree, X, Y];
}