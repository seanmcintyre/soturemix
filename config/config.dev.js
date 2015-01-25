var os = require('os');

module.exports = {
	"static_root": "http://" + os.hostname() + ":8081/",
	"video_root": "http://" + os.hostname() + ":8081/video/",
	"port": 8000,
	"appName": "sotuRemixDev",
	"clipsDirectory": "../app/video/desktop",
	"rootURL": "http://" + os.hostname() + ":8081/?_id=",
	"api_root": "",
	"templateFile": "_build/html/index.moustache"
}