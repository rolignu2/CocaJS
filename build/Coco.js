class Coco extends CocaAsync
{
	constructor(){
		super();
		this.query_ 		= "";
		this.query_result	= null;
	}
	
	query($query){
		return this._cmquery($query) ;
	}
	
	each ( $function , $array_object = null  , $number = true  ){
		
		 if(typeof $function !== 'function')
			 return this;
		 
		 let _arr = $array_object ;
		 if(_arr == null )
				_arr = this.query_result;
			
		
		 if(		typeof _arr == 'Array' 
			|| 		typeof _arr == 'array'
			|| 		typeof _arr == 'object'
		 ) {
			
			 for(let i in _arr){
				  
				  if(typeof _arr[i] == 'function')
					  continue;
				  if(typeof _arr[i] == 'number' && $number == false )
					  continue;
				  
				  $function( i , _arr[i] );
			 }
		 }
	}
	
	html ($val)
	{
		return this.query_result;
	}
	
	result(){
		return this.query_result;
	}
	
	Query($query){
		return this._cmquery($query);
	}
	
	_cmquery($query ){
		 this.query_ = $query ;
		 this.query_result = document.querySelectorAll($query);
		 return this;
	}
	
}

