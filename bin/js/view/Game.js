/**Created by the LayaAirIDE*/
var Game = (function (_super) {
	function Game() {
		Game.__super.call(this);
		this.initialize();
	}

	Laya.class(Game, 'Game', _super);

	var _proto = Game.prototype;

	_proto.initialize = function () {
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
		this.spaceMax = 350;
		this.blaArr = [];
		this.killTimes = 1;
		this.timeCount = 0;
		this.waitOver = false;
		this.stageTimeSpace = 20;
		this.difficultyAddRate = 0.1;
		this.overCount = 0;
		this.lv1Space = 20000;
		this.lv2Space = 600;
		this.lizardSpace = 1000;
		this.lizardLife = 5000;
		this.shoe = new shoe();
		this.shoe.visible = true;
		this.food = new Food();
		this.food.visible = true;
		this.shoe.start();
		this.count = 0;
		var _this = this;
		this.scoreNum = 0;
		this.scoreImgArr = [];
		this.bloodItemSize = { width: 30, height: 30 };
		this.bloodItemMargin = 6;
		this.foodBloodLength = 3;
		this.stages = [
			{
				minTimeCount: 0,
				maxTimeCount: 1000,
				lv1Space: 400,
				lv2Space: 600,
				lizardLife: 5000,
				lizardSpace: 1000
			},
			{
				minTimeCount: 1000,
				maxTimeCount: 3000,
				lv1Space: 100,
				lv2Space: 400,
				lizardLife: 5000,
				lizardSpace: 500
			}, {
				minTimeCount: 3000,
				maxTimeCount: 6000,
				lv1Space: 100,
				lv2Space: 100,
				lizardLife: 5000,
				lizardSpace: 400
			}, {
				minTimeCount: 6000,
				maxTimeCount: 9000,
				lv1Space: 50,
				lv2Space: 100,
				lizardLife: 5000,
				lizardSpace: 400
			}, {
				minTimeCount: 9000,
				maxTimeCount: 900000,
				lv1Space: 40,
				lv2Space: 100,
				lizardLife: 5000,
				lizardSpace: 400
			}
		]
		this.lizardTimer = 0;
		this.lizardTimer2 = 0;
		this.foodBloodLost = 0;
		this.bloodItemArr = [];
		this.addEventListeners();
		this.renderPage();
		this.initializeFoodBloodBar();
		this.gameBg.zOrder = -10;
		this.food.zOrder = -9;
		this.game.addChild(this.shoe);
		this.game.addChild(this.food);
		this.killBig = 0;
		this.shachongjiLife = 3000;
		this.shachongjiStartTime = 6000;
		this.timer.visible = true;
		if (window["wx"]) {
			wx.getSystemInfo({
				success: function (obj) {
					_this.device = new Laya.Point(obj.windowWidth, obj.windowHeight);
				}
			});
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
			if (this.shachongji && this.shachongji.isTouch(e.target.mouseX, e.target.mouseY)) {
				this.killTimes++;
				this.killAllLabel.text = "x" + this.killTimes;
				this.shachongji.removeSelf();
				this.shachongji = null;
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
			if (this.killTimes > 0 && !this.over) {
				this.killTimes--;
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
			if (this.bannerAd) {
				this.bannerAd.destroy();
				this.bannerAd = null;
			}
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
	}
	_proto.renderPage = function () {
		Laya.timer.loop(20, this, function () {
			if (this.over) {
				return;
			}
			this.scoreNum += 0.02;
			this.score.text = this.scoreNum.toFixed(2) + "s";
			this.initializeStageParams();
			if (this.timeCount % this.lv1Space == 0) {
				this.produceBlattaria(1);
			}

			if (this.timeCount > this.shachongjiStartTime) {
				this.shachongjiAppearSatus = true;
			}
			if (this.killBig >= 5) {
				this.killBig = 0;
				var rdd = Math.random();
				if (rdd < 0.5) {
					this.shachongji = new shanchongji();
					this.shachongji.appear();
					this.game.addChild(this.shachongji);
				}
			}
			if (this.shachongji) {
				this.shachongji.timer += 20;
			}


			if (this.shachongji && this.shachongji.timer >= this.shachongjiLife) {
				console.log("this.shachongji.disappear");
				this.shachongji.disappear();
				this.shachongji = null;
			}
			if (this.timeCount % this.lv2Space == 0) {
				this.produceBlattaria(2);
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

			this.checkOver();
		});
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
		this.count++;
		var x;
		var y;
		if (this.count % 8 == 0) {
			x = -10;
			y = rd(-10, 1350);
		} else if (this.count % 8 == 4) {
			x = 760;
			y = rd(150, 1350);
		} else if (this.count % 8 == 1 || this.count % 8 == 3 || this.count % 8 == 6) {
			x = rd(-10, 500);
			y = -20;
		} else if (this.count % 8 == 2 || this.count % 8 == 5 || this.count % 8 == 7) {
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
		this.killAllLabel.text = "x" + this.killTimes;
		shake(this, 8, 30);
	};

	_proto.checkOver = function () {
		return false;
	};

	_proto.aliveOpt = function () {
		this.recoverPanel.visible = true;
		this.timeCount.text = "30";
		var self = this;
		var tick = function () {
			Laya.timer.once(1e3, self, function () {
				var tv = parseInt(this.timeCount.text);
				tv--;
				if (tv <= 0 || !this.recoverPanel.visible) {
					this.timeCount.text = "0";
					return;
				} else {
					this.timeCount.text = tv + "";
					tick();
				}
			});
		};
		tick();
		this.aliveBtn.offAll();
		this.aliveBtn.on(Laya.Event.CLICK, this, function (e) {
			if (videoAd) {
				videoAd.load().then(function () {
					return videoAd.show();
				}).catch(function (err) {
					return console.log(err.errMsg);
				});
				videoAd.onClose(function (res) {
					if (res && res.isEnded || res === undefined) {
						self.toBeAlive();
					}
				});
			} else {
				self.toBeAlive();
			}
		});
		if (window["wx"]) {
			if (this.bannerAd) {
				this.bannerAd.destroy();
				this.bannerAd = null;
			}
			this.bannerAd = wx.createBannerAd({
				adUnitId: "adunit-ecc6ee807c2bf738",
				style: {
					left: 0,
					top: this.device.y - 100,
					width: this.device.x,
					height: 100
				}
			});
			this.bannerAd.show();
		}
	};

	_proto.btnClick = function (e) {
		switch (e.target.name) {
			case "add1Btn":
				this.lv1Space += 10;
				this.lv1Text.text = this.lv1Space + "";
				break;

			case "minu1Btn":
				this.lv1Space -= 10;
				if (this.lv1Space <= 0) {
					this.lv1Space = 10;
				}
				this.lv1Text.text = this.lv1Space + "";
				break;

			case "add2Btn":
				this.lv2Space += 100;
				this.lv2Text.text = this.lv2Space + "";
				break;

			case "minu2Btn":
				this.lv2Space -= 100;
				if (this.lv2Space <= 0) {
					this.lv2Space = 100;
				}
				this.lv2Text.text = this.lv2Space + "";
				break;

			case "spaceMaxAdd":
				this.spaceMax += 5;
				this.timeMax.text = this.spaceMax + "";
				break;

			case "spaceMaxMinu":
				this.spaceMax -= 5;
				this.timeMax.text = this.spaceMax + "";
				break;
		}
	};

	_proto.gameOver = function () {
		this.retryBtn.disabled = false;
		this.homeBtn.disabled = false;
		laya.media.SoundManager.playSound(gameOverMusic);
		this.shoe.visible = false;
		this.shoe.end();
		shake(this, 5);
		// for (var k in this.blaArr) {
		// 	this.blaArr[k].panel.removeSelf();
		// }
		// this.lizard.panel.removeSelf();
		this.food.visible = false;
		this.game.visible = false;
		this.gameOverPanel.visible = true;
		this.gameOverPanel.zOrder = 99;
		this.tips.text = "本次成绩：" + this.scoreNum.toFixed(2) + "s";
		// laya.media.SoundManager.playSound("res/music/fail.mp3");
		this.over = true;
		var _this = this;

		for (i = 0; i < this.bloodItemArr.length; i++) {
			this.bloodItemArr[i].removeSelf();
		}
		if (Laya.Browser.onMiniGame) {
			var data = [{ key: "score", value: this.scoreNum.toFixed(2) + "" }];
			// 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
			var openDataContext = wx.getOpenDataContext();
			openDataContext.postMessage({
				type: 'updateMaxScore',
				score: parseFloat(_this.scoreNum.toFixed(2))
			});
			console.log("主域发送updateMaxScore消息");

		}
		for (var i = this.scoreImgArr.length - 1; i >= 0; i--) {
			this.scoreImgArr[i].removeSelf();
		}
	};

	_proto.resetGame = function () {
		for (var k in this.blaArr) {
			this.blaArr[k].panel.removeSelf();
			this.blaArr[k] = null;
		}
		this.game.visible = true;
		this.gameOverPanel.visible = false;
		this.blaArr = [];
		this.waitOver = false;
		this.overCount = 0;
		this.scoreNum = 0;
		this.over = false;
		this.killTimes = 1;
		this.killAllLabel.text = "x1";
		this.foodBloodLost = 0;
		this.bloodItemArr = [];
		this.timer.visible = true;
		this.lv1Space = 200;
		this.lv2Space = 600;
		this.lizardSpace = 1000;
		this.lizardLife = 5000;
		this.lizardTimer = 0;
		this.lizardTimer2 = 0;
		this.timeCount = 0;
		this.killBig = 0;
		this.shachongjiAppearSatus = false;
		if (this.shachongji) {
			this.shachongji.removeSelf();
			this.shachongji = null;
		}
		if (this.lizard) {
			this.lizard.panel.removeSelf();
			this.lizard = null;
		}
		if (this.lizard2) {
			this.lizard2.panel.removeSelf();
			this.lizard2 = null;
		}
		this.initializeFoodBloodBar();
	};

	return Game;
})(GameUI)