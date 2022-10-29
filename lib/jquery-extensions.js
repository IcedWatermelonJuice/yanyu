// jquery 扩展
$.fn.tagName = function(){
	return this[0].tagName
}
$.fn.placeHolder = function() {
	return this.attr("placeholder") ? this.attr("placeholder") : ""
}
$.fn.val2 = function() {
	return this.val() ? this.val() : this.placeHolder()
}
