# LiVsSeng
* 测试 李一尘 VS 火工老僧 
* 攻方设定指模拟对李、僧的攻击强度
* 守方设定指对李、僧的坦度设定
* 伤害公式：攻方攻击x攻方攻击/(攻方攻击+守方防御-攻方穿甲x守方防御)
* 李的酒受到“冲脉”12%加成以及“岿然顶天”20%加成
* 控制台的“更多”支持自定义JS设置

# js命令

```javascript
// 李一尘 变量名Li 
// 火工老僧 变量名Seng 
// 模拟攻击者 变量名Attacker
// 人物对象当前属性变量名attack(攻击)、penetrate(穿甲)、defend(防御)、blood(气血)、block(免伤)，不会更改初始设定值
// 人物talent(天赋)先于skill(技能)发动

// 示例1 半血pk并且李的酒没有额外加成
create();// 创建对象实例,数据来源设定区
Li.blood=Li.blood/2;// 李一尘更改为半血
Seng.blood=Seng.blood/2;// 火工老僧更改为半血
Li.talent=function(){// 李一尘天赋更改
	var wine = Math.floor(this.backup.blood * 0.15);// this指当前人物对象，也就是Li。this.backup内保存初始设定值。这里是更改酒的回复效果
	if (this.blood + wine <= this.backup.blood) {// 当前血量this.blood + 酒wine 不大于 最大血量this.backup.blood 时执行回血
		this.blood = this.blood + wine;
		this.talentFlag = false;// 天赋关闭，防止一直触发天赋效果
		this.msg.cure = this.msg.cure + wine;// 回合日志里显示的回血数值 
		this.msg.talent = "天赋发动：喝酒";// 回合日志里显示的天赋效果
	}
}
Seng.talent();// 由于更改过气血，首先执行一次天赋更正防御属性
start("自定义");//开始回合模拟

// 示例2 内功自定义为万象魔功（通过技能skill实现）
function wanxiang(r){// 万象魔功
	var rate = Math.floor(30 * (r.backup.blood - r.blood) / r.backup.blood);// 损失血量比例
	var newBlock=r.backup.block+rate;// 根据损失血量比例加成后的免伤
	r.block = newBlock>=50?50:newBlock;// 考虑免伤上限50%
	r.msg.skill = "技能发动：免伤" + r.block + "%";// 回合日志里显示的技能效果
}
create();
Li.skill=function(round){// skill内可以使用round(回合数)
	wanxiang(this);
}
Seng.skill=function(){
	wanxiang(this);
}
start("自定义");

// 示例3 内功自定义为奶内（通过技能skill实现）
function nainei(r,round){// 奶内
	var cure=4400* 1.32;// 自定义回血，以及回血比例（冲脉12 岿然顶天20）
	if(round%4===0){ // 约定每4回合触发一次回血
		r.blood=r.blood+cure;
		r.blood=r.blood<=r.backup.blood?r.blood:r.backup.blood;// 考虑血上限
		r.msg.cure = r.msg.cure+cure; // 回合日志里显示的回血数值 
		r.msg.skill = "技能发动：回血"; // 回合日志里显示的技能效果
	}
}
create();
Li.skill=function(round){// skill内可以使用round(回合数)
	nainei(this,round);
}
Seng.skill=function(round){
	nainei(this,round);
}
start("自定义");
```
