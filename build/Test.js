


/*coca.extend( {
	"algoritmo" : function(){
		console.log("algun algoritmo");
	} , 
	"guard" : function(){
		console.log("hola guardia");
	}
});*/



//console.log(coca.o.algoritmo());
console.log(coca);

coca.ready(function(){
	
	var div = coca.query("div").each(function(a , b){
		console.log( b );
	});
	//console.log(div);
	
});


/*$.ajax({
	url : "https://httpbin.org/get",
	data : {
		format : "json"
	},
	success : function(response){
		console.log(response);
	}
});*/
coca.prepare().dataType().json();
coca.$$(function(){
	
	//HACER ALGO 
	return {
		url 		: "https://httpbin.org/get",
		data 		: {
			format : "json"
		}
	};
	
}).success(function(response){
	console.log(response);
});



/*chuco.$$({ 
		url : "https://api.ipify.org/" ,
		data : {
			format : "json",
			'data' : "hola",
			'mano' : "mundo",
		},
		//success : function(a)
		//{
			//console.log(a);
		//},
		wait : function(){
			console.log("CARGANDO......");
		},
		error : function(e)
		{
			console.log("Hubo un error");
			console.log(e);
		}
}).success(function(a){
	console.log(a);
	
});*/


//console.log(chuco.ShowProcess());
//console.log(chuco.ShowErrors());
