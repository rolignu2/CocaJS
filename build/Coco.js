class Coco extends  CocaEvents
{
	constructor(){
		super();
		this.query_ 		= [];
		this.query_result	= [];
		this.cindex			= 0 ;
	}
	
	query($query , $rename = null ){return this._cmquery($query , $rename);}
	
	Query($query , $rename = null  ){return this._cmquery($query , $rename );}
	
	Q($query , $rename = null ) {return this._cmquery($query , $rename);} 
	
	result( index = null  , pointer = false ){
		
		try{

			 switch(typeof index){
				 case "string":
						for(let i in this.query_){
							if(this.query_[i].child === index){
								index = this.query_[i].index - 1;
							    break;
							}
						}
						break;
				case "number":
				case "object":
				default :
						if(index == 0 
								|| index == null 
								|| index == 'undefined'
						   ) 
								index = (this.cindex - 1);
						else 
								index = (index-1);
						break;
			 }
			 
			if(!pointer){
				
				if(typeof this.query_result[index] == 'undefined') 
					return this;
				
				let l = this.query_result[index].length;
				return this.query_result[index][l-1];
			}
					
			else 
					return this;
			
		}
		catch(e){
			this._error_control("INTERNAL ERROR" , e);
		}
		
		return this;
		
	}
	
	find( query = ""  , rename = null  ){
	
	try{

		 switch(typeof query ){
			 
			 case null:
			 case 'undefined':
					break;
			 default :
					this._cmquery(query , rename );
					break;
		 }
		 
	}
	catch(e){
		this._error_control("NOT FOUND OR UNDEFINED" , e);
	}
		 
		 return this;
	}
	
	
	
	_cmquery($query , $rename ,  type = "__NODE" ){
		
		 let error = false ;
		 let cmd   = false ;
		 
		 try {
			 
				switch(typeof $query){
				 
					case 'object':
							/***
							
							
								El algoritmo debe de analizar antes el objeto que se introduce 
								como es un objeto en si necesitamos un algoritmo de analisis nodal 
								y verificar si ese objeto esta ya instanciado en el arreglo principal 
								
								si el algoritmo identifica el nodo que ya esta en uso (dentro de query_result)
								
								
							***/
							let Cn = $query.childNodes;
							let target = -1 ;
							let qa 	   = false ;
							for(let j = this.cindex ; j > 0  ; j--){
								 let s ;
								 for(let p in  this.query_result[j]){
									 s = this.query_result[j][p];
									 if(s.childNodes.length == Cn.length){
										let gh = (node1 , node2  , index)=> {
											index++;
											if(index > node2.length) return true;
											if(node1[index] == node2[index]) 
													return gh(node1 , node2 , index)
											else return false;
										};
										let d = gh(s.childNodes , Cn , -1 );
										if(d === true ){
											target = j;
											qa = true ;
											break;
										}else qa = false;
									 }
								 }
								 
								 if(qa === true ) break;
							}
							if(target === -1 ){
								 this.query_result.push([$query]);
							}
							else {
								 this.cindex = (target + 1);
								 cmd = true ;
							}
							break;
					case 'array' :
							this.query_result.push($query);
							break;
					default : 
							try{
							
								/**
									coca es capaz de identificar nombres personalizados 
									o id´s ya utilizados , para asi volver a reutilizar el codigo
									y evitar una carga mas de memoria en peticion de resultados
								**/
								let k = this._ViewRename($query , this.cindex);
								//coca devuelve un objeto query y target 
								if(k.query !== null  && k.target !== 0){
									//si existen entonces el index pasa a ser el principal 
									cmd = true ;
									this.cindex = k.target;
									break;
								}
								
								//m busca en el document
								let m = document.querySelectorAll($query);
								
								//	si no devuelve nada posiblemente debemos de buscar en los nodos 
								//	la onda es econtrarlo en el ultimo indexado para evitar una carga mayor 
								if(m.length == 0 ){
									 let u = this.query_result[this.cindex - 1].length - 1;
									 let r = this.query_result[this.cindex - 1 ][u];
									 this.query_result.push(r.querySelectorAll($query));
								}else{
									//si es un resultado del document entonces se agrega al arreglo 
									this.query_result.push(m);
								}
								
						}catch(n){
								
							if(typeof $query === 'string'){
								let p = new DOMParser();
								let r = p.parseFromString($query, "text/xml");
								this.query_result.push(r.childNodes);
							}
						}
						break;
				 
			 }
	
			
			if(!cmd){
				
				if($rename !== null ){
						for(let i in this.query_){
								if(this.query_.child ==  $rename){
									$rename = ($rename + String(this.cindex));
										break;
								}
						}
				}
		
				this._AddIndex();
	
				this.query_.push({
						index 	: this.cindex ,
						query 	: $query,
						error 	: error, 
						child  : $rename != null ? $rename : ("?child" + this.cindex ) 
				});
				
			
			}
				
			
		 }catch(e){
			 this._error_control("NOT VALID" , e)
			 error = true;
		 }
		 

	
		
		
		return  Object.create(
					Object.getPrototypeOf(this), 
					Object.getOwnPropertyDescriptors(this) 
				);
	}
	

	_AddIndex(){ this.cindex++ ;}
	

	_ViewRename($string , index = 1){
 
		
		if(index == 0 ) return {
			 target : 0,
			 query  : null 
		}
	  
	  
        let p = false ;
	    let c = String($string).localeCompare(this.query_[index - 1].query);
		
		if(c === 0){
			if(String($string).substr(0,1) == "#"){
				p = true ;
			}
		}
		
		if(	String($string).localeCompare(this.query_[index - 1].child) == 0 || p == true  ){
			return {
					target : this.query_[index - 1].index,
					query  : this.query_[index -1].query
			};
		}

		else{
			return this._ViewRename($string , (index - 1 ));
		}
		
		
		return {
			 target : 0,
			 query  : null 
		}
			
	}

	
}

/***
var xmlString = "<div id='foo'><a href='#'>Link</a><span></span></div>"
  , parser = new DOMParser()
  , doc = parser.parseFromString(xmlString, "text/xml");
doc.firstChild // => <div id="foo">...
doc.firstChild.firstChild // => <a href="#">...
**/

