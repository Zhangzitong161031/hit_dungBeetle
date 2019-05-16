class LayaApp {
    constructor() {
        const WebGL = laya.webgl.WebGL
        Laya.MiniAdpter.init(true, false);
        Laya.init(750, 1334, WebGL);
        Laya.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
        // Laya.stage.alignH = Laya.Stage.ALIGH_CENTER;
        // Laya.stage.alighV = Laya.Stage.ALIGH_MIDDLE;
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        Laya.stage.bgColor = "#ffffff";
        if (Laya.Browser.onMiniGame) {
            console.log("Laya.Browser.onMiniGame");
            this.resizedSharedCanvas();
        }
        this.beginLoad()
    }

    resizedSharedCanvas() {
        Laya.timer.once(1000, this, function () {
            //设置共享画布大小
            window['sharedCanvas'].width = Laya.stage.width;
            window['sharedCanvas'].height = Laya.stage.height;
            //主域往子域透传消息
            wx.postMessage({
                type: "resizeShared",
                data: {
                    width: Laya.stage.width,
                    height: Laya.stage.height,
                    matrix: Laya.stage._canvasTransform
                }
            });
            console.log("主域发送resizeShared消息！")
        });
    }
    // 加载资源
    beginLoad() {
        Laya.loader.load("res/atlas/comp.atlas", Laya.Handler.create(this, this.onLoaded), null, Laya.Loader.ATLAS)
    }
    // 加载完成回调
    onLoaded() {
        LayaApp.gameStart = new GameStart()
        Laya.stage.addChild(LayaApp.gameStart)
    }
}
//激活启动类
new LayaApp();

