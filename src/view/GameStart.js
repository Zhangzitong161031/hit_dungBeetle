/**
 * 启动界面类
 */
var GameStart = (function (_super) {
    function GameStart() {
        GameStart.__super.call(this);
        // var gameStartAnimate=new GameStartAnimate();
        // gameStartAnimate.visible=true;
        // gameStartAnimate.start();
        // this.page1.addChild(gameStartAnimate);

        addOnceClick(this.page1, this, function () {
            laya.media.SoundManager.playSound(clickMusic);
            this.page1.visible = false;
            this.page2.visible = true;
        })

        addOnceClick(this.startBtn, this, function () {
            laya.media.SoundManager.playSound(clickMusic);
            this.page2.visible = false;
            this.page3.visible = true;
        })

        addOnceClick(this.rankBtn, this, function () {
            laya.media.SoundManager.playSound(clickMusic);
            this.homeBtn.visible = true;
            this.startBtn.disabled = true;
            this.rankBtn.visible = false;
            this.shareBtn.visible = true;
            showOpenData(this, {
                type: "showRankList"
            });
            console.log("主域发送showRankList消息");
        })
        addOnceClick(this.homeBtn, this, function () {
            laya.media.SoundManager.playSound(clickMusic);
            if (this.rankSprite2) {
                this.rankSprite2.graphics.clear();
                this.rankSprite2.removeSelf();
                this.rankSprite2 = null;
                this.homeBtn.visible = false;
                this.startBtn.disabled = false;
                this.rankBtn.visible = true;
                this.shareBtn.visible = false;
            }
        });
        addOnceClick(this.shareBtn, this, function () {
            laya.media.SoundManager.playSound(clickMusic);
            wx.shareAppMessage({
                imageUrl: "http://www.md-qc.com/share.jpg",
                title: "屎壳郎历险记"
            });
        });
        addOnceClick(this.page3, this, function () {
            laya.media.SoundManager.playSound(clickMusic);
            this.removeSelf();
            if (!LayaApp.game) {
                LayaApp.game = new Game();
                Laya.stage.addChild(LayaApp.game);
            }
        })
        if (Laya.Browser.onMiniGame) {
            console.log("Laya.Browser.onMiniGame in GameStart");
            var _this = this;
            wx.getSystemInfo({
                success: function (res) {
                    if (res.screenWidth == 375 && res.screenHeight == 812) {
                        Laya.stage.height = 1624;
                        console.log("iPhone X in GameStart");
                        _this.page1.height = 1624;
                        _this.bg_02.height = 1624;
                        _this.page3.height = 1624;
                        _this.rankBtn.y += 100;
                        _this.startBtn.y += 100;
                        _this.homeBtn.y += 100;
                    } else {
                        console.log("not iPhone X in GameStart");
                    }

                }
            })
        } else {
            console.log("not Laya.Browser.onMiniGame in GameStart");
        }

    }

    Laya.class(GameStart, 'view.GameStart', _super);
    var _proto = GameStart.prototype;

    return GameStart;
})(GameStartUI)