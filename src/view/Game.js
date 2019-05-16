/**Created by the LayaAirIDE*/
var Game = (function (_super) {
	function Game() {
		Game.__super.call(this);
		this.initialize();
	}

	Laya.class(Game, 'Game', _super);

	var _proto = Game.prototype;

	_proto.initialize = function () {
		this.initIphoneXAdpter();
		this.blaArr = [];
		this.killAllTimes = 1;
		this.timeCount = 0;
		this.blattariaNum = 0;
		this.scoreNum = 0;
		this.scoreImgArr = [];
		this.bloodItemSize = { width: 30, height: 30 };
		this.bloodItemMargin = 6;
		this.foodBloodLength = 3;
		this.lizardSpace = 1000;
		this.lizardLife = 5000;
		this.lizardTimer = 0;
		this.lizardTimer2 = 0;
		this.foodBloodLost = 0;
		this.bloodItemArr = [];
		this.killBig = 0;
		this.shachongjiLife = 6000;
		this.shachongjiStartTime = 0;
		this.timer.visible = true;
		this.shachongjiArr = [];
		this.shachongjiStartDrop = true;
		this.killBigNumOfStartDrop = 2;
		this.shachongjiDropProbability = 1;
		this.fps = 35;
		this.stages = [
			{
				minTimeCount: 0,
				maxTimeCount: 1000000,
				lv1Space: 400,
				lv2Space: 600,
				lizardLife: 5000,
				lizardSpace: 1000
			},
			{
				minTimeCount: 10000000,
				maxTimeCount: 3000,
				lv1Space: 100,
				lv2Space: 400,
				lizardLife: 5000,
				lizardSpace: 500
			}, {
				minTimeCount: 300000000,
				maxTimeCount: 6000,
				lv1Space: 100,
				lv2Space: 100,
				lizardLife: 5000,
				lizardSpace: 400
			}, {
				minTimeCount: 6000000000,
				maxTimeCount: 9000,
				lv1Space: 50,
				lv2Space: 100,
				lizardLife: 5000,
				lizardSpace: 400
			}, {
				minTimeCount: 9000000000,
				maxTimeCount: 900000,
				lv1Space: 40,
				lv2Space: 100,
				lizardLife: 5000,
				lizardSpace: 400
			}
		];
		this.shoe = new shoe();
		this.shoe.visible = true;
		this.food = new Food();
		this.food.visible = true;
		this.shoe.start();
		this.game.addChild(this.shoe);
		this.game.addChild(this.food);
		this.gameBg.zOrder = -10;
		this.food.zOrder = -9;
		this.addEventListeners();
		this.renderPage();
		this.initializeFoodBloodBar();
	}

	_proto.initIphoneXAdpter = function () {
		if (Laya.Browser.onMiniGame) {
			console.log("Laya.Browser.onMiniGame in Game");
			var _this = this;
			wx.getSystemInfo({
				success: function (res) {
					console.log(res.model);
					if (res.screenWidth == 375 && res.screenHeight == 812) {
						Laya.stage.height = 1624;
						console.log("iPhone X in Game");
						_this.gameBg.height = 1624;
						_this.bg_05.height = 1624;
						_this.retryBtn.y += 50;
						_this.homeBtn.y += 50;
						_this.shareBtn.y += 50;
						_this.shareBtn2.y += 55;
						_this.rankBtn.y += 50;
						_this.tips.y += 55;
						_this.killAll.y += 50;
						_this.backBtn.y += 20
					} else {
						console.log("not iPhone X in Game");
					}
				}
			})
		} else {
			console.log("not Laya.Browser.onMiniGame in Game");
		}
	}

	_proto.addEventListeners = function () {
		addOnceClick(this.game, this, function (e) {
			if (this.blaArr.length > 0) {
				for (var k in this.blaArr) {
					if (this.blaArr[k].isTouch(e.target.mouseX, e.target.mouseY)) {
						this.blaArr[k].hit();
					}
				}
			}

			if (this.shachongjiArr.length > 0) {
				for (var k in this.shachongjiArr) {
					if (this.shachongjiArr[k].isTouch(e.target.mouseX, e.target.mouseY)) {
						this.killAllTimes++;
						this.killAllLabel.text = "x" + this.killAllTimes;
						this.shachongjiArr[k].disappear();
						this.shachongjiArr[k].live = false;
					}
				}
			}
			if (this.lizard && this.lizard.isTouch(e.target.mouseX, e.target.mouseY)) {
				this.lizard.hit();
			}
			if (this.lizard2 && this.lizard2.isTouch(e.target.mouseX, e.target.mouseY)) {
				this.lizard2.hit();
			}
		});

		addOnceClick(this.rankBtn, this, function () {
			laya.media.SoundManager.playSound(clickMusic);
			this.backBtn.visible = true;
			this.shareBtn.disabled = true;
			this.shareBtn2.visible = true;
			this.rankBtn.visible = false;
			this.retryBtn.disabled = true;
			this.homeBtn.disabled = true;
			showOpenData(this, {
				type: "showRankList"
			});
			console.log("主域发送showRankList消息");
		});


		addOnceClick(this.backBtn, this, function () {
			console.log("click backBtn");
			laya.media.SoundManager.playSound(clickMusic);
			if (this.rankSprite2) {
				this.rankSprite2.graphics.clear();
				this.rankSprite2.removeSelf();
				this.rankSprite2 = null;
				this.backBtn.visible = false;
				this.shareBtn.disabled = false;
				this.rankBtn.visible = true;
				this.shareBtn2.visible = false;
				this.retryBtn.disabled = false;
				this.homeBtn.disabled = false;
			}
		});

		addOnceClick(this.killAll, this, function () {
			laya.media.SoundManager.playSound(killAllMusic);
			if (this.killAllTimes > 0 && !this.over) {
				this.killAllTimes--;
				this.clearBla();
			}
		});

		addOnceClick(this.shareBtn, this, function () {
			laya.media.SoundManager.playSound(clickMusic);
			wx.shareAppMessage({
				imageUrl: "http://www.md-qc.com/share.jpg",
				title: "我打出了" + this.scoreNum.toFixed(2) + "s的成绩，我不信你能比我更高!"
			});
		});

		addOnceClick(this.shareBtn2, this, function () {
			laya.media.SoundManager.playSound(clickMusic);
			wx.shareAppMessage({
				imageUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=293976383,147943424&fm=27&gp=0.jpg",
				title: "仅供测试用！"
			});
		});

		addOnceClick(this.retryBtn, this, function () {
			laya.media.SoundManager.playSound(clickMusic);
			this.resetGame();
			laya.media.SoundManager.playSound("res/music/select.mp3");
		});

		addOnceClick(this.homeBtn, this, function () {
			laya.media.SoundManager.playSound(clickMusic);
			if (this.rankSprite2) {
				this.rankSprite2.graphics.clear();
				this.rankSprite2.removeSelf();
				this.rankSprite2 = null;
			}
			this.removeSelf();
			LayaApp.game = null;
			LayaApp.gameStart.page1.visible = true;
			LayaApp.gameStart.page3.visible = false;
			Laya.stage.addChild(LayaApp.gameStart)
		});
	}

	_proto.initializeFoodBloodBar = function () {
		for (i = this.foodBloodLength; i > 0; i--) {
			var bloodItem = new BloodItem();
			bloodItem.visible = true;
			bloodItemX = this.bloodBg.x + this.bloodIco.width + i * (this.bloodItemSize.width + this.bloodItemMargin);
			bloodItemY = this.bloodBg.y + this.bloodBg.height / 2 - bloodItem.height / 2;
			bloodItem.pos(bloodItemX, bloodItemY);
			this.bloodItemArr.push(bloodItem);
			this.game.addChild(bloodItem);
		}
	}

	_proto.initializeStageParams = function () {
		var stageObj;
		for (j = 0; j < this.stages.length; j++) {
			if (this.timeCount >= this.stages[j].minTimeCount && this.timeCount < this.stages[j].maxTimeCount) {
				stageObj = this.stages[j];
				this.setStageParams(stageObj);
				break;
			}
		}
	}

	_proto.setStageParams = function (stageObj) {
		this.lv1Space = stageObj.lv1Space;
		this.lv2Space = stageObj.lv2Space;
		this.lizardLife = stageObj.lizardLife;
		this.lizardSpace = stageObj.lizardSpace;
	}

	_proto.updateFoodBloodBar = function () {
		laya.media.SoundManager.playSound(loseHpMusic);
		this.bloodItemArr[this.foodBloodLost - 1].img.skin = "comp/lose_hp.png";
		console.log(this.bloodItemArr[this.foodBloodLost - 1].img.skin);
	}
	_proto.renderPage = function () {
		var frameTime = 1000 / this.fps;
		var scoreAddUnit = 1 / this.fps;
		Laya.timer.loop(frameTime, this, function () {
			if (this.over) {
				return;
			}
			this.scoreNum += scoreAddUnit;
			this.score.text = this.scoreNum.toFixed(2) + "s";
			this.initializeStageParams();
			if (this.timeCount % this.lv1Space == 0) {
				this.produceBlattaria(1);
			}
			if (this.timeCount % this.lv2Space == 0) {
				this.produceBlattaria(2);
			}
			if (this.timeCount > this.shachongjiStartTime) {
				this.shachongjiStartDrop = true;
			}
			if (this.killBig >= this.killBigNumOfStartDrop) {
				this.killBig = 0;
				this.dropShachongji();

			}
			if (this.shachongjiArr.length > 0) {
				this.updateShachongjiStatus();
			}

			this.timeCount += 2;
			if (this.timeCount % this.lizardSpace == 0) {
				this.produceLizard();
			}

			if (this.lizard) {
				this.lizardTimer += 20;
				this.lizard.move(rd(0, 360), rd(100, 300), 2);
			}
			if (this.lizard2) {
				this.lizardTimer2 += 20;
				this.lizard2.move(rd(0, 360), rd(100, 300), 2);
			}
			if (this.lizard && this.lizardTimer >= this.lizardLife) {
				this.lizard.panel.removeSelf();
				this.lizardTimer = 0;
				this.lizard = null;
			}

			if (this.lizard2 && this.lizardTimer2 >= this.lizardLife) {
				this.lizard2.panel.removeSelf();
				this.lizardTimer2 = 0;
				this.lizard2 = null;
			}
			if (this.blaArr.length > 0) {
				this.updateBlattariaStatus();
			}
		});
	}


	_proto.dropShachongji = function () {
		var rdd = Math.random();
		if (rdd < this.shachongjiDropProbability) {
			var shachongji = new shanchongji();
			shachongji.appear();
			this.game.addChild(shachongji);
			this.shachongjiArr.push(shachongji);
		}
	}

	_proto.updateBlattariaStatus = function () {
		var toRm = [];
		for (var k in this.blaArr) {
			this.blaArr[k].move(rd(0, 360), this.blaArr[k].lv == 1 ? 1 : 0.5);
			if (this.blaArr[k].toRemove) {
				this.blaArr[k].panel.removeSelf();
				toRm.push(k);
			}
		}
		for (var i = toRm.length - 1; i >= 0; i--) {
			this.blaArr.splice(toRm[i], 1);
		}
	}

	_proto.updateShachongjiStatus = function () {
		var toRmv = [];
		for (var k in this.shachongjiArr) {
			this.shachongjiArr[k].timer += 20;
			if (this.shachongjiArr[k].timer >= this.shachongjiLife) {
				this.shachongjiArr[k].live = false;
			}
			if (this.shachongjiArr[k].live == false) {
				console.log("this.shachongji.live is false");
				this.shachongjiArr[k].disappear();
				this.shachongjiArr[k].removeSelf();
				toRmv.push[k];
			}
		}
		for (var i = toRmv.length - 1; i >= 0; i--) {
			this.shachongjiArr.splice(toRm[i], 1);
		}
	}

	_proto.showScoreAnimate = function () {
		var scoreImg = new Laya.Sprite();
		scoreImg.pos(320, 400);
		Laya.stage.addChild(scoreImg);
		scoreImg.loadImage("comp/score_reduce.png");
		scoreImg.scale(2, 2);
		scoreImg.visible = true;
		Laya.Tween.to(scoreImg, { y: scoreImg.y - 150 }, 1000, Laya.Ease.backOut);
		this.scoreImgArr.push(scoreImg);
		var _this = this;
		Laya.timer.once(500, this, function () { scoreImg.removeSelf(); });
	}

	_proto.produceBlattaria = function (lv) {
		this.blattariaNum++;
		var x;
		var y;
		if (this.blattariaNum % 8 == 0) {
			x = -10;
			y = rd(-10, 1350);
		} else if (this.blattariaNum % 8 == 4) {
			x = 760;
			y = rd(150, 1350);
		} else if (this.blattariaNum % 8 == 1 || this.blattariaNum % 8 == 3 || this.blattariaNum % 8 == 6) {
			x = rd(-10, 500);
			y = -20;
		} else if (this.blattariaNum % 8 == 2 || this.blattariaNum % 8 == 5 || this.blattariaNum % 8 == 7) {
			x = rd(-10, 760);
			y = 1350;
		}
		var bla = new Blattaria(x, y, lv);
		this.game.addChild(bla.panel);
		bla.panel.zOrder = -8;
		this.blaArr.push(bla);
	};

	_proto.produceLizard = function () {
		var x = rd(50, 700);
		var y = rd(50, 1330);
		if (this.lizard) {
			this.lizard2 = new Lizard(x, y);
			this.game.addChild(this.lizard2.panel);
			this.lizard2.panel.zOrder = -8;
		} else {
			this.lizard = new Lizard(x, y);
			this.game.addChild(this.lizard.panel);
			this.lizard.panel.zOrder = -8;
		}
	}

	_proto.clearBla = function () {
		for (var k in this.blaArr) {
			this.blaArr[k].hit(true);
		}
		this.killAllLabel.text = "x" + this.killAllTimes;
		shake(this, 8, 30);
	};

	_proto.gameOver = function () {
		shake(this, 5);
		laya.media.SoundManager.playSound(gameOverMusic);
		this.updateUserMaxScore();
		this.retryBtn.disabled = false;
		this.homeBtn.disabled = false;
		this.shoe.visible = false;
		this.shoe.end();
		this.game.visible = false;
		this.gameOverPanel.visible = true;
		this.gameOverPanel.zOrder = 99;
		this.tips.text = "本次成绩：" + this.scoreNum.toFixed(2) + "s";
		this.over = true;
	};

	_proto.resetGame = function () {
		this.game.visible = true;
		this.gameOverPanel.visible = false;
		this.scoreNum = 0;
		this.over = false;
		this.killAllTimes = 1;
		this.killAllLabel.text = "x1";
		this.foodBloodLost = 0;
		this.timer.visible = true;
		this.lv1Space = 200;
		this.lv2Space = 600;
		this.lizardSpace = 1000;
		this.lizardLife = 5000;
		this.lizardTimer = 0;
		this.lizardTimer2 = 0;
		this.timeCount = 0;
		this.killBig = 0;
		this.shachongjiStartDrop = false;
		this.clearResources();
		this.initializeFoodBloodBar();

	};

	_proto.updateUserMaxScore = function () {
		var _this = this;
		if (Laya.Browser.onMiniGame) {
			var data = [{ key: "score", value: this.scoreNum.toFixed(2) + "" }];
			var openDataContext = wx.getOpenDataContext();
			openDataContext.postMessage({
				type: 'updateMaxScore',
				score: parseFloat(_this.scoreNum.toFixed(2))
			});
			console.log("主域发送updateMaxScore消息");
		}
	}

	_proto.clearResources = function () {
		for (i = 0; i < this.bloodItemArr.length; i++) {
			// this.bloodItemArr[i].img.skin = "comp/remaining_hp.png";
			this.bloodItemArr[i] = null;
		}
		for (j = 0; j < this.blaArr.length; j++) {
			this.blaArr[j].panel.removeSelf();
			this.blaArr[j] = null;
		}
		for (k = 0; k < this.shachongjiArr.length; k++) {
			this.shachongjiArr[k].panel.removeSelf();
			this.shachongjiArr[k] = null;
		}
		if (this.lizard) {
			this.lizard.panel.removeSelf();
			this.lizard = null;
		}
		if (this.lizard2) {
			this.lizard2.panel.removeSelf();
			this.lizard2 = null;
		}
		this.shachongjiArr = [];
		this.blaArr = [];
		this.bloodItemArr = [];
	}
	return Game;
})(GameUI)