//主方法
var Li = null,
	Seng = null,
	Attacker = null,
	enable = false,
	create = function() {
		Li = new role("李一尘", function() {
			var wine = Math.floor(this.backup.blood * 0.15 * 1.32);
			if (this.blood + wine <= this.backup.blood) {
				this.blood = this.blood + wine;
				this.talentFlag = false;
				this.msg.cure = wine;
				this.msg.talent = "天赋发动：喝酒";
			}
		});
		Seng = new role("火工老僧", function() {
			var rate = Math.floor(80 * (this.backup.blood - this.blood) / this.backup.blood);
			this.defend = parseInt(this.backup.defend * (1 + rate / 100));
			this.msg.talent = "天赋发动：防御1" + rate + "%";
		});
		Attacker = new role("攻击者", function(data) {
			if (data.attack) {
				Li.suffer(this);
				Seng.suffer(this);
			}
			var echo = Li.state() + " ; " + Seng.state();
			echo = data.msg && typeof data.msg === "string" ? (data.msg + echo) : echo;
			$("#results .logs").append(`<span>${echo}</span><br>`);
		});
	},
	judge = function() {
		var results = "";
		if (!Li.alive && Seng.alive) {
			results = "火工老僧胜出";
		} else if (Li.alive && !Seng.alive) {
			results = "李一尘胜出";
		} else {
			results = "无人胜出";
		}
		return results
	},
	start = function(type) {
		if (!type) {
			create();
		}
		$("#results .sug").hide();
		var num = 0;
		if ($("#results .logs").text()) {
			$("#results .logs").append("<br>")
		}
		$("#results .logs").append(
			`<span>回合设定 攻方：${Attacker.attack}攻 ${Attacker.penetrate}穿、${$(".role-defender").is(":visible")?("守方："+Attacker.config(true)):(Li.config()+"、"+Seng.config())}</span><br>`
		)
		Attacker.action({
			msg: `回合开始 `,
			attack: false
		});
		enable = true;
		while (enable && num < 99) {
			num = num + 1;
			if (Li.alive && Seng.alive) {
				Attacker.action({
					msg: `第 ${num} 回合 `,
					attack: true
				});
			} else {
				enable = false;
			}
		}
		$("#results .logs").append(`<span>回合结束 ${judge()}</span><br>`);
	},
	stop = function() {
		enable = false;
		$("#results .logs").append(`<span>回合已停止</span><br>`);
	},
	remove = function() {
		enable = false;
		setTimeout(() => {
			$("#results .logs").html("");
			$("#results .sug").show();
		}, 100)
	},
	reset = function() {
		enable = false;
		$(".attack").val("");
		$(".penetrate").val("");
		$(".defend").val("");
		$(".blood").val("");
		$(".block").val("");
	},
	more = function() {
		$(".items.role-defender").hide();
		$(".items.role-li").show();
		$(".items.role-seng").show();
		$("#settings").addClass("list-4").removeClass("list-3");
		$("#more").hide();
		$("#back").show();
		$("#js").show();
	},
	back = function() {
		$(".items.role-li").hide();
		$(".items.role-seng").hide();
		$(".items.role-defender").show();
		$("#settings").addClass("list-3").removeClass("list-4");
		$("#cmd").hide();
		$("#more").show();
		$("#back").hide();
		$("#js").hide();
	},
	js = function() {
		$("#cmd").is(":visible") ? $("#cmd").hide() : $("#cmd").show();
	};
$("body").ready(() => {
	$(".items.role-defender .defend").on("input propertychange", (e) => {
		$(".defend").val($(e.target).val());
	});
	$(".items.role-defender .blood").on("input propertychange", (e) => {
		$(".blood").val($(e.target).val());
	});
	$(".items.role-defender .block").on("input propertychange", (e) => {
		$(".block").val($(e.target).val());
	});
	$("#cmd .command button").click((e) => {
		var map = {
			execute: function() {
				eval($("#cmd .command textarea").val());
			},
			clear: function() {
				$("#cmd .command textarea").val("");
			},
			help: function() {
				if ($("#cmd .markdown").is(":visible")) {
					$("#cmd .markdown").hide();
					$(e.target).text("显示帮助");
				} else {
					$("#cmd .markdown").show();
					$(e.target).text("收起帮助");
				}
			},
			close:function(){
				$("#cmd").hide();
			}
		};
		map[$(e.target).data("fn")]();
	})
	$.get("README.md", (r) => {
		$("#cmd .markdown").html(marked.parse(r.slice(r.search("# js命令"))));
	})
})
