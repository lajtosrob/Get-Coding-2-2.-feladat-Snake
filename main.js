var jatek = {
    tickSzama: 0,
    idozito: null,
    pontszam: 0,
    tabla: [
        "###############",
        "#             #",
        "#             #",
        "#     ##      #",
        "#    ####     #",
        "#    ####     #",
        "#     ##      #",
        "#             #",
        "#             #",
        "#             #",
        "#             #",
        "###############"
    ],
    gyumolcs: [
        { x: 1, y: 1 },
    ],
    tick: function () {
        window.clearTimeout(jatek.idozito);
        jatek.tickSzama++;
        if (jatek.tickSzama % 10 == 0) {
            jatek.veletlenszeruGyumolcsHozzaadas();
        }
        var eredmeny = kigyo.mozgas();
        if (eredmeny == "gameover") {
            alert("Játék vége! A játékos pontszáma: " + jatek.pontszam);
            return;
        }
        grafika.jatekMegrajzolas();
        jatek.idozito = window.setTimeout("jatek.tick()", 200);
    },
    veletlenszeruGyumolcsHozzaadas: function () {
        var randomY = Math.floor(Math.random() * jatek.tabla.length) + 0;
        var randomX = Math.floor(Math.random() * jatek.tabla[randomY].length) + 0;
        var randomHely = { x: randomX, y: randomY };
        if (jatek.uresNegyzet(randomHely) && !jatek.gyumolcsNegyzet(randomHely)) {
            jatek.gyumolcs.push(randomHely);
        }
    },
    uresNegyzet: function (hely) {
        return jatek.tabla[hely.y][hely.x] == ' ';
    },
    falNegyzet: function (hely) {
        return jatek.tabla[hely.y][hely.x] == '#';
    },
    gyumolcsNegyzet: function (hely) {
        for (var gyumolcsSzama = 0; gyumolcsSzama < jatek.gyumolcs.length; gyumolcsSzama++) {
            var gyumolcs = jatek.gyumolcs[gyumolcsSzama];
            if (hely.x == gyumolcs.x && hely.y == gyumolcs.y) {
                jatek.gyumolcs.splice(gyumolcsSzama, 1);
                return true;
            }
        }
        return false;
    },
    kigyoNegyzet: function (hely) {
        for (var kigyoResz = 0; kigyoResz < kigyo.reszek.length; kigyoResz++) {
            var resz = kigyo.reszek[kigyoResz];
            if (hely.x == resz.x && hely.y == resz.y) {
                return true;
            }
        }
        return false;
    }
};
var kigyo = {
    reszek: [
        { x: 4, y: 2 },
        { x: 3, y: 2 },
        { x: 2, y: 2 }
    ],
    irany: "E",
    kovetkezoHely: function () {
        var kigyoFej = kigyo.reszek[0];
        var celX = kigyoFej.x;
        var celY = kigyoFej.y;
        celY = kigyo.irany == "N" ? celY - 1 : celY;
        celY = kigyo.irany == "S" ? celY + 1 : celY;
        celX = kigyo.irany == "W" ? celX - 1 : celX;
        celX = kigyo.irany == "E" ? celX + 1 : celX;
        return { x: celX, y: celY };
    },
    mozgas: function () {
        var hely = kigyo.kovetkezoHely();
        if (jatek.falNegyzet(hely)
            || jatek.kigyoNegyzet(hely)) {
            return "gameover";
        }
        if (jatek.uresNegyzet(hely)) {
            kigyo.reszek.unshift(hely);
            kigyo.reszek.pop();
        }
        if (jatek.gyumolcsNegyzet(hely)) {
            kigyo.reszek.unshift(hely);
            jatek.pontszam++;
        }
    }
};
var grafika = {
    canvas: document.getElementById("canvas"),
    negyzetMeret: 30,
    tablaMegrajzolas: function (ctx) {
        var aktualisYoffset = 0;
        jatek.tabla.forEach(function sorEllenorzes(sor) {
            sor = sor.split('');
            var aktualisXoffset = 0;
            sor.forEach(function karakterEllenorzes(karakter) {
                if (karakter == '#') {
                    ctx.fillStyle = "black";
                    ctx.fillRect(aktualisXoffset, aktualisYoffset, grafika.negyzetMeret, grafika.negyzetMeret);
                }
                aktualisXoffset += grafika.negyzetMeret;
            });
            aktualisYoffset += grafika.negyzetMeret;
        });
    },
    megrajzolas: function (ctx, megrajzolando, color) {
        megrajzolando.forEach(function (resz) {
            var reszXhelye = resz.x * grafika.negyzetMeret;
            var reszYhelye = resz.y * grafika.negyzetMeret;
            ctx.fillStyle = color;
            ctx.fillRect(reszXhelye, reszYhelye, grafika.negyzetMeret, grafika.negyzetMeret);
        });
    },
    jatekMegrajzolas: function () {
        var ctx = grafika.canvas.getContext("2d");
        ctx.clearRect(0, 0, grafika.canvas.width, grafika.canvas.height);
        grafika.tablaMegrajzolas(ctx);
        grafika.megrajzolas(ctx, jatek.gyumolcs, "red");
        grafika.megrajzolas(ctx, kigyo.reszek, "green");
    }
};
var jatekIranyitas = {
    beviteliEsemeny: function (lenyomottBillentyu) {
        var key = lenyomottBillentyu.key.toLowerCase();
        var celIrany = kigyo.irany;
        if (key == "w" && kigyo.irany != "S") celIrany = "N";
        if (key == "a" && kigyo.irany != "E") celIrany = "W";
        if (key == "s" && kigyo.irany != "N") celIrany = "S";
        if (key == "d" && kigyo.irany != "W") celIrany = "E";
        kigyo.irany = celIrany;
        jatek.tick();
    },
    jatekInditas: function () {
        window.addEventListener("keypress", jatekIranyitas.beviteliEsemeny, false);
        jatek.tick();
    }
};
jatekIranyitas.jatekInditas();