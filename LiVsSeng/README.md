# yanyu
* LiVsSeng : 李一尘 VS 火工老僧 测试

# js命令

```javascript
// 李一尘 变量名Li 
// 火工老僧 变量名Seng 
// 模拟攻击者 变量名Attacker
// 人物对象当前属性变量名attack(攻击)、penetrate(穿甲)、defend(防御)、blood(气血)、block(免伤)，不会更改初始设定值
// 示例
create();// 创建对象实例,数据来源设定区
Li.blood=Li.blood/2;// 李一尘更改为半血
Seng.blood=Seng.blood/2;// 火工老僧更改为半血
Li.talent=function(){// 李一尘天赋更改
	var wine = Math.floor(this.backup.blood);// this指当前人物对象，也就是Li。this.backup内保存初始设定值。这里是更改酒的回复效果
	if (this.blood + wine <= this.backup.blood) {// 当前血量this.blood + 酒wine 不大于 最大血量this.backup.blood 时执行回血
		this.blood = this.blood + wine;
		this.talentFlag = false;// 天赋关闭，防止一直触发天赋效果
		this.msg.cure = wine;// 回合记录里显示的回血数值 
		this.msg.talent = "天赋发动：喝酒";// 回合记录里显示的天赋效果文字
	}
}
Seng.talent();// 由于更改过气血，首先执行一次天赋更正防御属性
start("自定义");//开始回合模拟
```
