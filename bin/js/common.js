/*
* name;
*/

var screenWidth = 750;

var screenHeight = 1334;

CrawlRectangleHeight = 0.3881 * screenHeight;

var Handler = Laya.Handler;
var clickMusic="res/music/click.mp3";
var gameOverMusic="res/music/gameOver.mp3";
var killAllMusic="res/music/killAll.mp3";
var loseHpMusic="res/music/lose_hp.mp3";
var lv1DieMusic="res/music/lv1_die.mp3";
var lv2DieMusic="res/music/lv2_die.mp3";
var lv2HitMusic="res/music/lv2Hit.mp3";
var warningMusic="res/music/warning.mp3";
var rd = function (min, max) {
    return Math.round(Math.random() * 1e13) % (max - min + 1) + min;
};

var videoAd = window["wx"] ? wx.createRewardedVideoAd({
    adUnitId: "adunit-ee2cfd4009c8bd9c"
}) : null;

// 单次点击
function addOnceClick(btn, caller, func) {
    btn.offAll();
    btn.on(Laya.Event.CLICK, caller, func);
}

function http(ip, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", ip, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // var response = xhr.responseText.substr(1,xhr.response.length-2);
            var response = xhr.responseText;
            var result = JSON.parse(response);
            if (callback) {
                callback(result);
            }
        }
    };
    xhr.send();
}

function blink(obj, delay, times, show) {
    if (times > 0) {
        Laya.Tween.to(obj, {
            alpha: show ? 1 : 0
        }, delay, null, Handler.create(this, function () {
            blink(obj, delay, --times, !show);
        }), show ? 0 : 100);
    }
}

function showOpenData(parent, arg, showClose) {
    if (showClose === void 0) {
        showClose = null;
    }
    if (window["wx"]) {
        Laya.timer.once(1000, parent, function () {
            if (Laya.Browser.onMiniGame) {
                parent.rankSprite2 = new Laya.Sprite();
                parent.rankSprite2.pos(0, 0);
                var rankTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                rankTexture.bitmap.alwaysChange = true;
                //小游戏使用，非常费，每帧刷新
                parent.rankSprite2.graphics.drawTexture(rankTexture, 0, 0, rankTexture.width, rankTexture.height);
                Laya.stage.addChild(parent.rankSprite2);
                wx.postMessage(arg);

            }
        });
    }
}

function isIPhoneX(){
    var u = navigator.userAgent;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {        
        if (screen.height == 812 && screen.width == 375){
            console.log("iphoneX");
        }else{
            console.log("not iphoneX");
        } 
    }
}
 

var shake = function (obj, num, time) {
    var dx = num == 0 ? 0 : Math.random() * 1e8 % 10 * (parseInt(Math.random() * 100 + "") % 2 == 0 ? 1 : -1);
    var dy = num == 0 ? 0 : Math.random() * 1e8 % 10 * (parseInt(Math.random() * 100 + "") % 2 == 0 ? 1 : -1);

    Laya.Tween.to(obj, {
        x: dx,
        y: dy
    }, time || 50, null, Laya.Handler.create(this, function () {
        if (num > 0) {
            shake(obj, num - 1, time);
        }
    }));
};


function getAngle(panelX, panelY, foodX, foodY) {
    var cos;
    var dx = Math.abs(foodX - panelX);
    var dy = Math.abs(foodY - panelY);
    var dz = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    var cos = dy / dz;
    var radina = Math.acos(cos);//用反三角函数求弧度
    var angle = Math.floor(180 / (Math.PI / radina));
    if (panelX > foodX && panelY < foodY) {
        // 第一象限
        angle = angle;
    } else if (panelX > foodX && panelY > foodY) {
        // 第二象限
        angle = 180 - angle;
    } else if (panelX < foodX && panelY > foodY) {
        // 第三象限
        angle = 180 + angle;
    } else if (panelX < foodX && panelY < foodY) {
        // 第四象限
        angle = - angle;
    }
    return angle;
}