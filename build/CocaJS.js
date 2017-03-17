class CocaJS extends Coco{
	
	constructor(){
		super();
		this.errors 			= [];
		this.o 					= {};
		this.version			= "0.1.0";
	}
	
	version() { return this.version ;} 
	
	extend ()
	{
		
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		var merge = function (obj) {
			for ( var prop in obj ) {
            if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                    extended[prop] = extend( true, extended[prop], obj[prop] );
                } else {
                    extended[prop] = obj[prop];
					}
				}
			}
		};

		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		this.o =  Object.create(extended);
		
	}
	
	
	Ready (callback) {
		var ready = false;

		var detach = function() {
			if(document.addEventListener) {
				document.removeEventListener("DOMContentLoaded", completed);
				window.removeEventListener("load", completed);
			} else {
				document.detachEvent("onreadystatechange", completed);
				window.detachEvent("onload", completed);
			}
		}
		var completed = function() {
			if(!ready && (document.addEventListener || event.type === "load" || document.readyState === "complete")) {
				ready = true;
				detach();
				callback();
			}
		};

		if(document.readyState === "complete") {
				callback();
		} else if(document.addEventListener) {
				document.addEventListener("DOMContentLoaded", completed);
				window.addEventListener("load", completed);
		} else {
			
			document.attachEvent("onreadystatechange", completed);
			window.attachEvent("onload", completed);

        var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if(top && top.doScroll) {
				(function scrollCheck() {
					if(ready) return;

					try {
						top.doScroll("left");
					} catch(e) {
						return setTimeout(scrollCheck, 50);
					}

					ready = true;
					detach();
					callback();
            })();
		}
		}
	}
	
	
	ready(callback)
	{
		this.Ready(callback);
	}
	
	
	
}
