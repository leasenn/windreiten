//********************************************
// windreiten.ch
// Lea Senn, 8.3.2017
// www.leasenn.ch
//********************************************
$(document).ready(function(){

    //********************************************
    // ScrollMagic
    //********************************************
	
    // Initialisiere Controller
    var controller = new ScrollMagic.Controller();
    
    if(!isTouchDevice()) {
        
        // Intro anpinnen
        var pinIntroScene = new ScrollMagic.Scene({
            triggerElement: '#intro',
            triggerHook: 0, 
            duration: '50%'
        })
        .setPin('#intro', {pushFollowers: false})
        .addTo(controller);
        
        $("#introVideo").get(0).play(); // http://stackoverflow.com/questions/28532539
        
        // Intro einfaden
        var fadeIntroScene = new ScrollMagic.Scene({
            triggerElement: '#main',
            triggerHook: 0.8
        })
        .setClassToggle('.introtext', 'fade-in') // Klasse 'fade-in' zu Team hinzufügen
        //.addIndicators()
        .addTo(controller);
        
        // Team einfaden
        var tweenTeam = TweenMax.staggerTo('.team', 0.5, {y:0, opacity:1}, 0.1);
        var pinTeamScene = new ScrollMagic.Scene({
            triggerElement: '#team',
            triggerHook: 0.7
        })
        .setTween(tweenTeam)
        //.addIndicators()
        .addTo(controller);
        
        // Hülle anpinnen (nicht sichtbar)
        var pinHuelleScene = new ScrollMagic.Scene({
            triggerElement: '#ballonscroll',
            triggerHook: 0,
            duration: "1"
        })
        .setPin('#img1', {pushFollowers: false})
        .addTo(controller);
        
        // Hülletext einfaden
        var pinHuelleTextScene = new ScrollMagic.Scene({
            triggerElement: '#ballonscroll',
            triggerHook: 0.3
        })
        .setClassToggle('#p1', 'fade-in')
        //.addIndicators({name:"Hülletext", indent:400})
        .addTo(controller);

        // Brenner anpinnen
        var pinBrennerScene = new ScrollMagic.Scene({
            triggerElement: '#ballonscroll',
            triggerHook: 0.2, 
            duration: '70'
        })
        .setPin('#img2', {pushFollowers: false})
        //.addIndicators({name:"Brenner"})
        .addTo(controller);

        // Brennertext einfaden
        var pinBrennerTextScene = new ScrollMagic.Scene({
            triggerElement: '#ballonscroll',
            triggerHook: 0.2
        })
        .setClassToggle('#p2', 'fade-in')
        //.addIndicators({name:"Brennertext", indent:400})
        .addTo(controller);



        // Korb anpinnen
        var pinKorb1Scene = new ScrollMagic.Scene({
            triggerElement: '#ballonscroll',
            triggerHook: 0.2, 
            duration: '70'
        })
        .setPin('#img3', {pushFollowers: false})
        //.addIndicators({name:"Korb1", indent:200})
        .addTo(controller);

        var pinKorb2Scene = new ScrollMagic.Scene({
            triggerElement: '#ballonscroll',
            triggerHook: 0.1, 
            duration: '35'
        })
        .setPin('#img3', {pushFollowers: false})
        //.addIndicators({name:"Korb2", indent:50})
        .addTo(controller);

        // Korbtext einfaden
        var pinKorbTextScene = new ScrollMagic.Scene({
            triggerElement: '#ballonscroll',
            triggerHook: 0.1
        })
        .setClassToggle('#p3', 'fade-in')
        //.addIndicators({name:"Korbtext", indent:400})
        .addTo(controller);
        
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
            $(this).nextAll('.modal').modal('show');
            var name = "#mdl"+$(this).attr("id").slice(3); // Herausfinden, welche Person geklickt wurde
            $(name).modal('show');
        });

        
    } else { // Ist Touchdevice

        // Sichtbare Formatierung forcieren
        $(".introtext").css("opacity",1);
        $(".team").css("opacity",1);
        $(".pBallon").css("opacity",1);
        //$("#vorstellung-02").css("width","auto");
        
        // Warnung
        $("#intro-01").prepend('<div class="alert alert-warning" role="alert">Diese Seite ist optimiert für Desktops. F&uuml;r das beste Nutzererlebnis besuche diese Seite von einem Computer aus.</div>');
        
        $("#fahrt-05").prepend('<div class="alert alert-warning" style="margin:20px" role="alert">Um dich w&auml;hrend der Ballonfahrt im 360°-Video zu bewegen, <a href="https://www.youtube.com/watch?v=v6rcuyeIsRY" target="_blank">&ouml;ffne das Video in der YouTube App</a> oder wechsle an einen Computer.</div>');
        
        $(".modal").each(function() {
            var videoUrl = $(this).find("iframe").attr('src');
            $(this).removeClass("modal fade");
            $(this).removeAttr("tabindex role aria-hidden aria-labelledby");
            var selector = "button[data-target='#"+$(this).attr("id")+"']";
            $(selector).replaceWith('<iframe src="'+videoUrl+'" frameborder="0" class="iframeTeam" allowfullscreen></iframe>');
            $(this).remove();
        });
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
                recaptcha: $("#g-recaptcha-response").val()
            },
            type: "POST",
            dataType: "json",
            success: function(data) {
                if(data.success) { 
                    if($("#wettbewerbResponse").hasClass("alert-danger")) {  // Falls Eingabe korrigiert wurde und nun korrekt ist
                        $("#wettbewerbResponse").removeClass("alert alert-danger"); 
                    }
                    $("#wettbewerbResponse").addClass("alert alert-success"); 
                    $("input").each(function() {
                        $(this).val("");
                    });
                    grecaptcha.reset();
                }
                else { 
                    $("#wettbewerbResponse").addClass("alert alert-danger"); 
                    grecaptcha.reset();
                }
                $("#wettbewerbResponse").text(data.message);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });
    
    
    //********************************************
    // Modals aktivieren und YouTube Video laden
    //********************************************
    
    var modalData = [
      { 
          name: "Pilot",
          src: "https://www.youtube.com/embed/1TJeLbJXbLI?autoplay=1&rel=0"
      }, { 
          name: "Passagier",
          src: "https://www.youtube.com/embed/EBTajFzmfCU?autoplay=1&rel=0"
      }, { 
          name: "Verfolger",
          src: "https://www.youtube.com/embed/1FQ_bCpFl0o?autoplay=1&rel=0"
      }
    ];
    
    $.each(modalData, function(index, value) {
        $("#iframe"+value.name).attr('src', '');
        $("#mdl"+value.name).on('hide.bs.modal', function() {
            $("#iframe"+value.name).attr('src', '');
        });      
        $("#mdl"+value.name).on('show.bs.modal', function() {
            $("#iframe"+value.name).attr('src', value.src);
        });
    });
    
    
    // Autocomplete Wetter laden
    $.getJSON("data/city.list.json", function(data) {
        console.log("success loading json");
        $("#inputStadt").autocomplete({
            minLength:3,
            source: function(request, response) {
                var results = data.map(function(e) {
                    return e.name + ", " + e.country;
                })
                results = $.ui.autocomplete.filter(results, request.term);
                response(results.slice(0,5));
            },
            select: function() {
                console.log("selected");
                berechneStadt();
            }
            //source: '{"test1","london","lavin","las vegas"}'
        });
    }).fail(function() {
        console.log("Loading json failed");
    });
    
    
});

// Prüfe, ob Touchdevice oder Desktop
function isTouchDevice() {
    return 'ontouchstart' in window        
  || navigator.maxTouchPoints;

}


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
      videoId: 'v6rcuyeIsRY'
    });
    
    
}


//********************************************
// Elemente scrollbasiert auslösen
//********************************************
var shouldStartAgain = true;
var enterTriggered = false;
var leaveTriggered = true;

var shouldStartAgain360 = true;
var enterTriggered360 = false;
var leaveTriggered360 = true;

var shouldStartAgainWetter = true;
var enterTriggeredWetter = false;
var leaveTriggeredWetter = true;

var usingTouch = isTouchDevice();
$(window).scroll(function() {
    if(!usingTouch) { // Automatisches Abspielen deaktivieren für Touchdevices
        // Video Intro beim Vorbeiscrollen automatisch starten und stoppen
        $("iframe#yt-vorstellung-intro").each( function() {
            if( ($(window).scrollTop() > $(this).offset().top - 400) && ($(window).scrollTop() < $(this).offset().top + 300)) {
                // on Enter
                if(!enterTriggered) {
                    // Check if First time
                    enterTriggered = true;
                    leaveTriggered = false;

                    if(shouldStartAgain == true) {
                        player.playVideo();
                    }  
                }
            } else { // Wenn Video ausserhalb von sichtbaren Bereich: stoppen
                // on leave
                if(!leaveTriggered) {
                    // Check if first time
                    leaveTriggered = true;
                    enterTriggered = false; // Jetzt musst du wieder neu triggern, weil Bild verlassen wurde! 

                    if((player.getPlayerState() == 1 || player.getPlayerState() == 3)) { // Läuft das Video gerade?
                        shouldStartAgain = true;
                    } else {
                        shouldStartAgain = false;
                    }
                    player.pauseVideo();  
                }

            }
        }); 

        // Video 360 beim Vorbeiscrollen automatisch starten und stoppen
        $("iframe#yt-vorstellung-360").each( function() {
            if( ($(window).scrollTop() > $(this).offset().top - 200) && ($(window).scrollTop() < $(this).offset().top + 300)) { // Solange Video in sichtbaren Bereich: abspielen
                // on Enter
                if(!enterTriggered360) {
                    enterTriggered360 = true;
                    leaveTriggered360 = false;

                    if(shouldStartAgain360 == true) {
                        player360.playVideo();
                    }
                }

            } else { // Wenn Video ausserhalb von sichtbaren Bereich: stoppen
                // on Leave
                if(!leaveTriggered360) {
                    leaveTriggered360 = true;
                    enterTriggered360 = false;

                    if((player360.getPlayerState() == 1 || player360.getPlayerState() == 3)) {
                        shouldStartAgain360 = true;
                    } else {
                        shouldStartAgain360 = false;
                    }
                    player360.pauseVideo();
                }

            }
        }); 
    
    }
    // Prüfen, ob Tacho im sichtbaren Bereich ist
    if( ($(window).scrollTop() > $("#wetter").offset().top - 600 && $(window).scrollTop() < $("#wetter").offset().top + 300)) {
        if($('#tacho-img').css("animation-name") == "spin") { // solange noch Standardwert
            berechneWetter(); // berechne einmalig das Wetter
        }
        if(!enterTriggeredWetter) {
            enterTriggeredWetter = true;
            leaveTriggeredWetter = false;
            
            if(shouldStartAgainWetter) {
                $("#audioWetter").trigger('play');
            }
        }
        
    } else {
        if(!leaveTriggeredWetter) {
            leaveTriggeredWetter = true;
            enterTriggeredWetter = false;
            
            if(!$("#audioWetter")[0].paused && !$("#audioWetter")[0].ended && 0 < $('#audioWetter')[0].currentTime) { // Wenn Video läuft....
                shouldStartAgainWetter = true;
            }  else {
                shouldStartAgainWetter = false;
            }
            $("#audioWetter").trigger('pause'); 
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
            $('#tacho-img').css("animation-name", "spin"); // Tacho zurücksetzen
            tachoAusfuellen(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Wetter konnte nicht geladen werden");
        }
    });
}

$("#btnStadt").click(function(event) {
    event.preventDefault();
    berechneStadt();
});

// Berechne Stadt (nach Click auf Button oder Click auf Auswahl bei Autocomplete)
function berechneStadt() {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather',
        dataType: "json",
        type: "GET",
        data: {
            units: "metric",
            q: $("#inputStadt").val(),
            lang: 'de',
            APPID: "a9fb7b1bd2ebc0438c97fae9a24ff62c"
        },
        success: function(data) {
            tachoAusfuellen(data);
            $("#inputStadt").val(""); // Inputfeld zurücksetzen

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error requesting cityweather");
        }
    });
}

// Tacho ausfüllen
function tachoAusfuellen(data) {
    // Liste erstellen
    var date = new Date(data.dt*1000);

    // Wettermeta in Statusabsatz
    $("#wetterStatus").html('Das Wetter für '+data.name+' ('+data.sys.country+') vom ' + date.getDate() + "." + (date.getMonth()+1) +"." + date.getFullYear() + " um " + date.getHours() + ":" + date.getMinutes() + ' Uhr');

    $("#wetterInfo").html(""); // Leeren
    // Wetterinfo ausfüllen
    $("#wetterInfo").append('<li class="li0">Temperatur: ' + data.main.temp + ' °C</li>');

    bewoelkung = berechneBewoelkung(data.clouds.all);
    $("#wetterInfo").append('<li class="li' + bewoelkung + '">Bewölkung: ' + data.clouds.all + ' %</li>');


    $("#wetterInfo").append(berechneWind(data.wind));

    var dunkelheit = berechneDunkelheit(data.sys.sunrise, data.sys.sunset);
    $("#wetterInfo").append('<li class="li' + dunkelheit[0] + '">Tageslicht: ' + dunkelheit[1] + '</li>');

    var niederschlag = berechneNiederschlag(data.weather[0].id);
    $("#wetterInfo").append('<li class="li' + niederschlag + '">Wetterlage: ' + grossschreibung(data.weather[0].description) + '</li>');

    // Finale Entscheidung als Text einblenden
    var entscheidung = berechneTacho(data);
    $("#wetterEntscheidung").html(""); // Leeren
    if(entscheidung == 0) { $("#wetterEntscheidung").append("Eine Ballonfahrt in " + data.name + " ("+data.sys.country+") scheint zurzeit möglich."); }
    else if(entscheidung == 1) { $("#wetterEntscheidung").append("Eine Ballonfahrt in " + data.name + " ("+data.sys.country+") scheint zurzeit nur bedingt möglich."); }
    else { $("#wetterEntscheidung").append("Eine Ballonfahrt in " + data.name + " ("+data.sys.country+") scheint zurzeit nicht möglich."); }
}

// Berechne Windausgabe
function berechneWind(wind) {
    var output = "";
    if(wind.deg !== undefined) {
        output += '<li class="li0">Windrichtung: ' + Math.round((wind.deg)*100)/100 + '° (' + berechneRichtung(wind.deg) + ')</li>';
    }
    if(wind.speed !== undefined) {
        windstaerke = berechneWindstaerke(wind.speed);
        output += '<li class="li' + windstaerke + '">Windstärke: ' + Math.round((wind.speed*3.6)*10)/10 + ' km/h</li>';
    }
    return output;
}

// Berechen Dunkelheit
function berechneDunkelheit(sunrise, sunset) {
    timestampNow = Date.now(); // Aktueller Timestamp in Millisekunden
    // Wenn vor Sonnenuntergang
    if(timestampNow < sunrise*1000-1800*1000) {
        return [2, "Noch zu dunkel"];
    }
    else if(timestampNow >= sunrise*1000-1800*1000 && timestampNow < sunrise*1000) {
        return [1, "Knapp schon genug hell"];
    }
    else if(timestampNow >= sunrise*1000 && timestampNow < sunset*1000 ) { // Sonne scheint
        return [0, "Genug hell"];
    }
    else if(timestampNow >= sunset*1000 && timestampNow < sunset*1000+1800*1000) {
        return [1, "Knapp noch genug hell"];
    }
    else if(timestampNow >= sunset*1000+1800*1000) {
        return [2, "Schon zu dunkel"];
    }
    else {
        console.log("Fehler beim Berechnen der Dunkelheit");
    }
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

// Berechne Bewölkung
function berechneBewoelkung(bewoelkung) {
    if(bewoelkung < 50) { return 0; }
    else if(bewoelkung >= 50 && bewoelkung < 75) { return 1; }
    else { return 2; }
}

// Berechne Windstärk
function berechneWindstaerke(windstaerke) {
    if(windstaerke < 2.22) { return 0; }
    else if(windstaerke >= 2.22 && windstaerke < 3.33) { return 1; }
    else { return 2; }
}

// Berechne Niederschlag
function berechneNiederschlag(niederschlag) {
    if(niederschlag >= 800 && niederschlag <= 803) { return 0; }
    else if(niederschlag == 8004) { return 1; }
    else { return 2; }
}

// Tatsächliche Berechnung, ob Ballonfahrt möglich ist
function berechneTacho(data) {
    // wobei 0 = OK, 1 = EVT, 2 = NO
    var moeglichkeit = 0;
    var degree = 0;
    
    // Bewölkung abklären
    var bewoelkung = berechneBewoelkung(data.clouds.all);
    
    // Windstärke abklären
    var windstaerke = berechneWindstaerke(data.wind.speed);
    
    // Niederschlag abklären
    var niederschlag = berechneNiederschlag(data.weather[0].id);
    
    // Dunkelheit abklären
    var dunkelheit = berechneDunkelheit(data.sys.sunrise, data.sys.sunset)[0];
    
    // Berechnung
    if (bewoelkung+windstaerke+niederschlag+dunkelheit == 0) {degree = 145; moeglichkeit = 0;}
    else if (bewoelkung <= 1 && windstaerke <= 1 && niederschlag <= 1 && dunkelheit <= 1) {degree = 90; moeglichkeit = 1;}
    else {degree = 35; moeglichkeit = 2;}
    
    $('#tacho-img').css("transform", "rotate("+degree+"deg)");
    $('#tacho-img').css("animation-name", "spin"+moeglichkeit);
    return moeglichkeit;
}

// Mache immer den ersten Buchstaben eines Wortes gross
function grossschreibung(str) {
    str = str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); // Alle ersten Buchstaben gross
    // Ausnahmen
    str = str.replace("Paar", "paar");
    str = str.replace("üBerwiegend", "Überwiegend");
    str = str.replace("Bewölkt", "bewölkt");
    return str;
}

//********************************************
// Google Analytics 
//********************************************

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-93137681-1', 'auto');
  ga('send', 'pageview');





