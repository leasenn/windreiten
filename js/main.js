//********************************************
// windreiten.ch
// Lea Senn, 8.3.2017
// www.leasenn.ch
//********************************************
$(document).ready(function(){
    
    // Prüfe, ob Touchdevice oder Desktop
   function is_touch_device() {
        return 'ontouchstart' in window;
    }

    //********************************************
    // ScrollMagic
    //********************************************
	
    // Initialisiere Controller
    var controller = new ScrollMagic.Controller();
    
    if(!is_touch_device()) {
        
        // Intro anpinnen
        var pinIntroScene = new ScrollMagic.Scene({
            triggerElement: '#intro',
            triggerHook: 0, 
            duration: '50%'
        })
        .setPin('#intro', {pushFollowers: false})
        .addTo(controller);
        
        $("#introVideo").get(0).play(); // http://stackoverflow.com/questions/28532539
        
        // Introtext einfaden
        
    }
    
    // Scrollfunktionen / Navigation
    controller.scrollTo(function (newScrollPos) {
        $("html, body").animate({scrollTop: newScrollPos});
    });
    
    $("#intro").click(function() {
        controller.scrollTo("#main");
        
    });
    
    $("#wettbewerbabschicken").click(function() {
        $.ajax({
            url: "wettbewerb.php",
            data: {
                vorname: $("#vorname").val(),
                name: $("#name").val(),
                adresse: $("#adresse").val(),
                plz: $("#plz").val(),
                ort: $("#ort").val(),
                land: $("#land").val(),
                email: $("#email").val(),
            },
            type: "POST",
            dataType: "json",
            success: function(data) {
                console.log(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });
    
    
    //********************************************
    // Modals aktivieren und YouTube Video laden
    //********************************************
    // Pilot
    $("#iframePilot").attr('src', '');
    $("#mdlPilot").on('hide.bs.modal', function() {
        $("#iframePilot").attr('src', '');
    })      
    $("#mdlPilot").on('show.bs.modal', function() {
        $("#iframePilot").attr('src', 'https://www.youtube.com/embed/e7oC06sLGfc?autoplay=1');
    })
    
    // Passagier
    $("#iframePassagier").attr('src', '');
    $("#mdlPassagier").on('hide.bs.modal', function() {
        $("#iframePassagier").attr('src', '');
    })    
    $("#mdlPassagier").on('show.bs.modal', function() {
        $("#iframePassagier").attr('src', 'https://www.youtube.com/embed/pi7tNUuuzvA?autoplay=1');
    })
    
    // Verfolger
    $("#iframeVerfolger").attr('src', '');
    $("#mdlVerfolger").on('hide.bs.modal', function() {
        $("#iframeVerfolger").attr('src', '');
    })    
    $("#mdlVerfolger").on('show.bs.modal', function() {
        $("#iframeVerfolger").attr('src', 'https://www.youtube.com/embed/2B2EQRy2ScU?autoplay=1');
    })
    
});

//********************************************
// Team Abschnitt interaktiv
//********************************************
$(".teamimage").hover(function() {
    var originalsrc = $(this).attr('src').slice(0,-4); // Add _hover
    $(this).attr('src', originalsrc+'_hover.png');
}, function() {
    var originalsrc = $(this).attr('src').slice(0,-10); // Remove _hover
    $(this).attr('src', originalsrc+'.png');
});

$(".teamimage").click(function() {
    //console.log($(this).nextAll('.modal'));
    $(this).nextAll('.modal').modal('show');
});

// Modale Dialoge zentrieren horizontal
/*$('.modal').each(function(){
    $(this).modal('show').css({
        'margin-top': function () { //vertical centering
            return -($(this).height() / 2);
        },
        'margin-left': function () { //Horizontal centering
            return -($(this).width() / 2);
        }
    });
});*/

//********************************************
// YouTube Videos einbinden
//********************************************
// YouTube API laden
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// YouTube Player in Platzhalter Intro & 360 einfüllen
var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('yt-vorstellung-intro', {
      height: '100%',
      width: '100%',
      playerVars : {
            rel:0,
            autoplay : 0
            /*controls : 0, später wieder einschalten!*/
        },
      videoId: 'XsEItOvDZzE'
    });
        
    player360 = new YT.Player('yt-vorstellung-360', {
      height: '100%',
      width: '100%',
      playerVars : {
            rel:0,
            autoplay : 0
            /*controls : 0, später wieder einschalten!*/
        },
      videoId: 'H8IkgYsWGhg'
    });
    
    
}


//********************************************
// Elemente scrollbasiert auslösen
//********************************************
$(window).scroll(function() {
    
    // Video Intro beim Vorbeiscrollen automatisch starten und stoppen
    $("iframe#yt-vorstellung-intro").each( function() {
        if( ($(window).scrollTop() > $(this).offset().top - 200) && ($(window).scrollTop() < $(this).offset().top + 300) ) { // Solange Video in sichtbaren Bereich: abspielen
            player.playVideo();
        } else { // Wenn Video ausserhalb von sichtbaren Bereich: stoppen
            player.pauseVideo();
        }
    }); 
    
    // Video 360 beim Vorbeiscrollen automatisch starten und stoppen
    $("iframe#yt-vorstellung-360").each( function() {
        if( ($(window).scrollTop() > $(this).offset().top - 200) && ($(window).scrollTop() < $(this).offset().top + 300) ) { // Solange Video in sichtbaren Bereich: abspielen
            player360.playVideo();
        } else { // Wenn Video ausserhalb von sichtbaren Bereich: stoppen
            player360.pauseVideo();
        }
    }); 
    
    // Prüfen, ob Tacho im sichtbaren Bereich ist
    //console.log("window scrolltop: "+$(window).scrollTop()+" wettertop: "+$("#wetter").offset().top);
    if( ($(window).scrollTop() > $("#wetter").offset().top - 300)) {
        if($('#tacho-img').css("animation-name") == "spin") { // solange noch Standardwert
            berechneWetter(); // berechne einmalig das Wetter
        }
    }
});


//********************************************
// Wetter berechnen
//********************************************
function berechneWetter() {
    $('#tacho-img').css("animation-name", "spin3"); // verhindere, dass Funktion durch Scrollevent erneut ausgeführt wird, bevor Antwort geladen wurde
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather',
        dataType: "json",
        type: "GET",
        data: {
            units: "metric",
            id: '7287650', // ID von Zürich Stadt
            lang: 'de',
            APPID: "cb1bd4d3e7ff8998307ff5883a6c8382"
        },
        success: function(data) { // Wenn erfolgreich Daten zurück kommen...
            var liste = document.createElement("ul");
            var date = new Date(data.dt*1000);
            $(liste).append('<li>Das Wetter für Zürich vom ' + date.getDate() + "." + (date.getMonth()+1) +"." + date.getFullYear() + " um " + date.getHours() + ":" + date.getMinutes() + ' Uhr</li>');
            $(liste).append('<li>Temperatur: ' + data.main.temp + ' °C</li>');
            $(liste).append('<li>Bewölkung: ' + data.clouds.all + ' %</li>');
            $(liste).append(berechneWind(data.wind));
            $(liste).append(berechneDunkelheit(data.sys.sunrise, data.sys.sunset));
            $(liste).append('<li>Wetterlage: ' + data.weather[0].description + '</li>');
            $("#wetterdaten").empty(); // Lösche Text "Lade Wetterdaten..."
            $("#wetterdaten").append($(liste));
            
            // Finale Entscheidung als Text einblenden
            var entscheidung = berechneTacho(data);
            if(entscheidung == 0) { $("#wetterdaten").append("Eine Ballonfahrt scheint zurzeit möglich."); }
            else if(entscheidung == 1) { $("#wetterdaten").append("Eine Ballonfahrt scheint zurzeit nur bedingt möglich."); }
            else { $("#wetterdaten").append("Eine Ballonfahrt scheint zurzeit unmöglich."); }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error requesting cityweather");
        }
    });
}

// Berechne Windausgabe
function berechneWind(wind) {
    var output = "";
    if(wind.deg !== undefined) {
        output += '<li>Windrichtung: ' + wind.deg + '° (' + berechneRichtung(wind.deg) + ')</li>';
    }
    if(wind.speed !== undefined) {
        output += '<li>Windstärke: ' + Math.round((wind.speed*3.6)*10)/10 + ' km/h</li>';
    }
    return output;
}

// Berechen Dunkelheit
function berechneDunkelheit(sunrise, sunset) {
    sunrise = new Date(1492835036*1000);
    console.log(sunrise.toLocaleString());
}

// Berechne Windrichtung in Text aufgrund von Grad
function berechneRichtung(deg) {
    if(deg > 22.5 && deg <= 67.5) { return 'NO' }
    else if(deg > 67.5 && deg <= 112.5) { return 'O' }
    else if(deg > 112.5 && deg <= 157.5) { return 'SO' }
    else if(deg > 157.5 && deg <= 202.5) { return 'S' }
    else if(deg > 202.5 && deg <= 247.5) { return 'SW' }
    else if(deg > 247.5 && deg <= 292.5) { return 'W' }
    else if(deg > 292.5 && deg <= 337.5) { return 'NW' }
    else if(deg > 337.5 || deg <= 22.5) { return 'N' }
    else return "Windrichtung unbekannt"
}

// Tatsächliche Berechnung, ob Ballonfahrt möglich ist
function berechneTacho(data) {
    // wobei 0 = OK, 1 = EVT, 2 = NO
    var moeglichkeit = 0;
    var degree = 0;
    
    // Bewölkung abklären
    var bewoelkung = 0;
    if(data.clouds.all < 50) { bewoelkung = 0; }
    else if(data.clouds.all >= 50 && data.clouds.all < 75) { bewoelkung = 1; }
    else { bewoelkung = 2; }
    
    // Windstärke abklären
    var windstaerke = 0;
    if(data.wind.speed < 2.22) { windstaerke = 0; }
    else if(data.wind.speed >= 2.22 && data.wind.speed < 3.33) { windstaerke = 1; }
    else { windstaerke = 2; }
    
    // Niederschlag abklären
    var niederschlag = 0;
    if(data.weather[0].id >= 800 && data.weather[0].id <= 803) { niederschlag = 0; }
    else if(data.weather[0].id == 8004) { niederschlag = 1; }
    else { niederschlag = 2; }
    
    // Berechnung
    if (bewoelkung+windstaerke+niederschlag == 0) {degree = 145; moeglichkeit = 0;}
    else if (bewoelkung <= 1 && windstaerke <= 1 && niederschlag <= 1) {degree = 90; moeglichkeit = 1;}
    else {degree = 35; moeglichkeit = 2;}
    
    $('#tacho-img').css("transform", "rotate("+degree+"deg)");
    $('#tacho-img').css("animation-name", "spin"+moeglichkeit);
    return moeglichkeit;
}

//********************************************
// Google Analytics Code hier
//********************************************














