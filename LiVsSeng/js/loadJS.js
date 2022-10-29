(function() {
	var debugLogs = false; //是否输出加载日志
	async function loadJS(data) {
		function createScript(src, callback) {
			return new Promise(resolve => {
				callback = typeof callback === "function" ? callback : function() {
					return null
				}
				var cb = {
					success: function() {
						callback();
						resolve("has been loaded");
					},
					error: function() {
						resolve("load timeout")
					}
				}
				var script = document.createElement("script");
				script.src = src;
				document.head.appendChild(script);
				if (script.readyState) { //IE
					script.onreadystatechange = function() {
						if (script.readyState == 'complete' || script.readyState == 'loaded') {
							script.onreadystatechange = null;
							cb.success();
						}
					}
				} else { //非IE
					script.onload = function() {
						cb.success();
					}
				}
				setTimeout(() => cb.error(), 1000);
			})
		}
		for (let i in data) {
			let res = await createScript(data[i].src, data[i].callback);
			if (debugLogs) {
				console.log(i + " " + res);
			}
		}
	}
	fetch("js/manifest.json").then((res) => {
		return res.json();
	}).then((data) => {
		loadJS(data);
	})
})()
