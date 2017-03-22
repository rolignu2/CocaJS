class CocaEvents extends  CocaAsync 
{
	
	constructor(){
		super();
		this.event_listener = null ;
	}
	
	on ( $event , $function ) {
		
		if(typeof ($event) !== 'string' && typeof ($function) !== 'function' )
			 return this;
		 
		 
		this.query_result[0].addEventListener($event , $function);
		return this;
	}
	
	click( $function ){
		return this.on("click" , $function);
	}
	
	change($function){
		return this.on("change" , $function);
	}
	
	mouseover ($function){
		return this.on("mouseover" , $function);
	}
	
	mouseout ($function){
		return this.on("mouseout" , $function);
	}
	
	keydown ($function){
		return this.on("keydown" , $function);
	}
	
	onLoad ($function){
		return this.on("load" , $function);
	}
	
	event(e){
		this.event_listener = e ;
		return this;
	}
	
	eventType(){
		return this.event_listener.type;
	}
	
	toTarget(){
		try{
			return this.event_listener.toElement;
		}catch(e){
			this.errors.push(e);
		}
	}
	
	
	
}