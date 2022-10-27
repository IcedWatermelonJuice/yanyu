//人物构造方法
function role(name, talent) {
	this.name = name;
	name = $(".role-defender").is(":visible") || name === "攻击者" ? "默认" : name;
	var source = "." + {
		"默认": "role-defender",
		"李一尘": "role-li",
		"火工老僧": "role-seng"
	} [name] + " ";
	this.backup = {
		attack: parseInt($(".role-attacker .attack").val2()),
		penetrate: parseInt($(".role-attacker .penetrate").val2() * 100) / 100,
		defend: parseInt($(source + ".defend").val2()),
		blood: parseInt($(source + ".blood").val2()),
		block: parseInt($(source + ".block").val2() * 100) / 100
	}
	this.attack = this.backup.attack;
	this.penetrate = this.backup.penetrate;
	this.defend = this.backup.defend;
	this.blood = this.backup.blood;
	this.block = this.backup.block;
	this.talentFlag = typeof talent === "function";
	this.talent = this.talentFlag ? talent : function() {
		this.msg.talent = "";
		return null
	}
	this.msg = {};
	this.alive = true;
}
role.prototype = {
	config: function(noName) {
		return `${noName?"":(this.name+"：")}${this.defend}防 ${this.blood}血 ${this.block}免`;
	},
	state: function() {
		var msg = "";
		if (this.msg.injury) {
			msg += `${msg?";":""}<span class="msg-injury">-${this.msg.injury}</span>`;
		}
		if (this.msg.talent) {
			msg += `${msg?";":""}<span class="msg-talent">${this.msg.talent}</span>`;
		}
		if (this.msg.cure) {
			msg += `${msg?";":""}<span class="msg-cure">+${this.msg.cure}</span>`;
		}
		msg = msg ? `(${msg})` : "";
		return `${this.name}:${this.alive?`气血${this.blood}/${this.backup.blood} ${msg}`:"<span style='color:red'>已死亡</span>"}`
	},
	action: function(params) {
		//攻击
		this.talent(params);
	},
	suffer: function(role) {
		this.msg = {};
		var injury = role.attack * role.attack / (role.attack + this.defend * (1 - role.penetrate / 100)) * (1 -
			this.block / 100);
		injury = Math.floor(injury);
		this.msg.injury = injury;
		this.blood = this.blood - injury;
		if (this.blood <= 0) {
			this.alive = false;
			this.blood = 0;
		}
		if (this.alive && this.talentFlag) {
			this.talent();
		}
	}
}
