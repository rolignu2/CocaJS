class CocaAsync {
	
	constructor(){
		this.queue 				= [];
		this.options = {
			contentType 	: 'application/x-www-form-urlencoded; charset=UTF-8',
			crossDomain     : false ,
			dataType		: 'html',
			method 			: "GET"
		};
		this.point 			= null;
		this.succes_wait	= null;
		this.error_wait 	= null;
		
	}
	
	prepare () { return this;}
	
	contentType($t) { 
		this.options.contentType = $t ;
		return this;
	}
	
	converters($t){
		this.options.converters = $t;
		return this;
	}
	
	crossDomain($t){
		this.options.crossDomain = $t;
		return this;
	}
	
	dataType($j = null ){
		if($j == null ) return this;
		this.options.dataType = $j ;
		return this;
	}
	
	headers($h){
		this.options.headers = $h;
		return this;
	}
	
	json(){return this.dataType("json");}
	
	html(){return this.dataType("html");}
	
	xml(){return this.dataType("xml");}
	
	text() { return this.dataType("text"); }
	
	
	Ajax ( $operation = {}  , $url = "" , $objects = {} ,  $wait = null , $success = null , $error = null){
		return this.init($operation , $url , $objects , $wait , $success , $error);
	}
	
	ajax( $operation = {}  , $url = "" , $objects = {} ,  $wait = null , $success = null , $error = null){
		return this.init($operation , $url , $objects , $wait , $success , $error);
	}
	
	$$( $operation = {}  , $url = "" , $objects = {} ,  $wait = null , $success = null , $error = null){
		return this.init($operation , $url , $objects , $wait , $success , $error);
	}
	
	ShowErrors (){
		return this.errors;
	}
	
	ShowProcess(){
		return this.queue ;
	}
	
	success( $func ){
		if(typeof $func == 'function')
			this.succes_wait = $func;
		else 
			this.succes_wait = null;
		return this;
	}
	
	error ($func){
		if(typeof $func == 'function')
			this.error_wait = $func;
		else 
			this.error_wait = null;
		return this;
	}
	
	response(){
		return this.queue[this.point].response;
	}
	
	alive(){
		return this.queue[this.point].response;
	}
	
	init( $operation = {}  , $url = "" , $objects = "" ,  $wait = null , $success = null , $error = null )
	{
		
		let optype 			= typeof $operation;
		var $flags			= {
				 object 		: true , 
				 wait   		: true , 
				 success 		: true , 
				 error  		: true 
			};
		
		try{
			
			let $i  			= this._pRequest();
			this.point 			= $i;
			

			switch(optype)
			{
				case 'function' :
					$operation = $operation();
					$url =  $operation.url !== 'undefined' ? $operation.url : $url;
					$objects = $operation.data;
					$wait   = $operation.wait;	
					$success = $operation.success ;
					$error = $operation.error ; 
					break;
				case 'object' :
					$url =  $operation.url !== 'undefined' ? $operation.url : $url;
					$objects = $operation.data;
					$wait   = $operation.wait;	
					$success = $operation.success ;
					$error = $operation.error ; 
					break;
				case null  		 :
				case 'undefined' :
				case isNaN 		 : 
				case '' 		 :
				case ""			 : 
						// HELLO ITS ME :) 
						break;
			}
			
			
			
			if($url == "" || typeof $url == 'undefined') {
						
					this.errors.push({
							 id 		:  Math.floor((Math.random() * 555555) + 1),
							 cause 		: "url isNaN or Empty",
							 process	: $i
					});
						
					this._kRequest($i);
					return this;
			}
					
			
			if($operation.method != 'undefined' &&  $operation.method != null )
							this.options.method = $operation.method;
			else 
							this.options.method = "GET";
						
			if(typeof $objects == 'undefined')
							$flags.object = false ;
			if(typeof $wait == 'undefined')
							$flags.wait = false;
			if(typeof $success == 'undefined')
							$flags.success = false;
			if(typeof $error == 'undefined')
						    $flags.error = false;
		
			
			let $p_ = '' ;
			if(typeof $objects == 'object')
				$p_ = this._parserObj($objects);
			
			
			$url += $p_;
			
			var $this = this;
			this.queue[$i.index].request.onreadystatechange = function() {
				if ($this.queue[$i.index].request.readyState === XMLHttpRequest.DONE) {
					let response = $this.queue[$i.index].request.responseText;
					switch($this.queue[$i.index].request.status){
						case 200:
						
							if($this.options.dataType == 'json' 
									|| $this.options.dataType == 'JSON'
									|| $this.options.dataType == 'Json'
							)
							{
								try{
									response = JSON.parse(response);
								}catch(e){
									$this.errors.push({
											id 		:  Math.floor((Math.random() * 555555) + 1),
											cause 		: e,
											process	: 'JSON'
									});
								}
							}
						
							if( $flags.success == true ){
								$success(response);
								$this.queue[$i.index].success = $success;
							}
							else if($this.succes_wait !== null ){
								$this.succes_wait(response);
								$this.queue[$i.index].success = $this.succes_wait;
							}
							
							$this.queue[$i.index].response = response;
							break;
						case 500 :
						case 501 :
						case 502 :
						case 504 :
						case 508 :
						case 509 :
						case 404 :
						case 400 :
						case 402 :
						case 403 : 
						case 406 :
						case 407 : 
						case 408 :
						case 410 :
						case 429 :
							if( $flags.error == true ){
								$error(response);
								$this.queue[$i.index].error = $error;
							}
							else if($this.error_wait !== null ){
								$this.error_wait(response);
								$this.queue[$i.index].error = $this.error_wait;
							}
							$this.queue[$i.index].response = response;
							break;
					}
					
					$this.queue[$i.index].alive = false;
				}
				else if ($this.queue[$i.index].request.readyState === XMLHttpRequest.LOADING)
				{
					 if($flags.wait)
						 $wait();
				}
			};
			
			
			this.queue[$i.index].request.open(this.options.method , $url , true  );
			try{
				
				
				if(typeof this.options.crossDomain == 'boolean' && this.options.crossDomain == true  )
						this.queue[$i.index].request.setRequestHeader('Access-Control-Allow-Origin', '*');
				else if(typeof this.options.crossDomain == 'string' )
						this.queue[$i.index].request.setRequestHeader('Access-Control-Allow-Origin',this.options.crossDomain );
				
				
				this.queue[$i.index].request.setRequestHeader('Content-Type' , this.options.contentType);
				
				this.queue[$i.index].request.send();
			}
			catch(e){
				
				 this.errors.push({
							 id 		: Math.floor((Math.random() * 555555) + 1),
							 cause 		: e,
							 process	: "XHTML ERROR TO SEND "
				});
				
				if($flags.error)
					$error(e);
			}
			
			
			
		}
		catch(e){
			this.errors.push({
							 id 		:  Math.floor((Math.random() * 555555) + 1),
							 cause 		: e,
							 process	: optype
					});
		}
		
		
		
		return this;
	}

	_parserObj($object)
	{
		let a = "?";
		let k = Object.keys($object).length;
		let i = 0;
		for( let obj in $object )
		{
			i++;
			a += (obj + "=" + $object[obj] );
			if(i !== k) a += "&";
			
		}
		
		return a;
	}
	
	_pRequest ()
	{
		this.queue.push( {
			 request  : new XMLHttpRequest() , 
			 alive    : true , 
			 id       : (this.queue.length + 1),
			 success  : function(){},
			 error    : function(){},
			 type     : "",
			 method   : "GET",
			 response : null 
		});
		
		return  {
			index :  (this.queue.length - 1) ,
			id    :  (this.queue[this.queue.length - 1].id)
		} ;
	}
	
	_gRequest( $obj = null , $id = null  )
	{
		
		try{
			if($obj !== null ){
				return this.queue[$obj];
			}
		
			for( let q in this.queue  )
			{
				if(q.id ===  $id  )
					return q;
			}
		}
		catch(e){
			console.log(e);
		}
		
		return null;
	}
	
	_kRequest ($process )
	{
		 try{
			if(typeof $process == 'object'){
				delete this.queue[$process.index] ;
				return true ;
			}
			else {
				for(let i = 0 ;  i < this.queue.length ; i++){
					if(this.queue[i].id == $process &&  i !== id )
					{
						delete this.queue[i];
						break;
					}						
				}
				
				return true;
			}
		 }
		 catch(e){
			 this.errors.push({
							 id 		: Math.floor((Math.random() * 555555) + 1),
							 cause 		: e,
							 process	: null
			 });
		 }
		 
		 return false;
		
	}
	
	
	
}

