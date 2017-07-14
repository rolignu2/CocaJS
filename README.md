# CocaJS

  Version 0.1.2 
  
  [![Build Status](https://secure.travis-ci.org/mde/timezone-js.png)](https://secure.travis-ci.org/mde/timezone-js)

``` Escrita con VanillaJS; CocaJS pretende ser mas rapida que JQUERY pero no pretende destronarla como el mejor Framework o el mas usado ``` : Totalmente Re-Escrita a su antecesor Coca 0.1.1 , con un algoritmo de analisis nodal en cual permite que cocaJS sea mas rapida que         JQUERY y utilice menos recursos 

## Como se usa : 
  
  ``` Antes que nada CocaJS se esta desarrollando a pequeños pasos pero solidos asi que carece de muchas funciones Que nos obliga a coexistir con JQUERY ```
  
  
  Descargate el repositorio y a continuacion "Busca" Coca.js o coca.min.js  y una vez que guardes ese script 
  en donde desee tu corazon, mandalo a llamar de esta forma.

```
    <script src="../Aguna-ruta/Coca.js" type="text/javascript" ></script>
```

  Vamos bien.
  
  CocaJS trabaja en armonia con JQUERY si en dado caso desea usar en paralelo , aunque JQUERY es mas lento :D 
  
  ## Como llamar a cocaJS 
  
```js

      /***
         Palabras reservadas son coca o Coca  en dado caso no exista Jquery podemos usar $ como instancia ejemplo 
      ****/
      
    
    C(document).ready( ()=> { console.log("Coca esta listo");  }  );
    
    $C("div").each( (a,b)=>{ console.log( "key="  a + " value=" + b ) } )
    
    
    /***  OJO !! si JQUERY no existe o no esta definido podemos usar  "$" como instancia  ***/
    
    
    $(document).ready( ()=> { console.log("Coca esta listo");  }  );
    
    $("div").each( (a,b)=>{ console.log( "key="  a + " value=" + b ) } )

    
```


