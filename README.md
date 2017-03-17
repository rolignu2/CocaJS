# CocaJS

  Version 0.1.0 (Alpha)

``` Escrita con VanillaJS CocaJS pretende ser mas rapida que JQUERY pero no pretende destronarla como el mejor Framework o el mas usado ``` : i'm in love with the coco

## Como se usa : 
  
  ``` Antes que nada CocaJS se esta desarrollando a pequeños pasos pero solidos asi que carece de muchas funciones Que nos obliga a coexistir con JQUERY ```
  
  
  Descargate el repositorio y a continuacion "Busca" Coca.js y una vez que guardes ese script 
  en donde desee tu corazon, mandalo a llamar de esta forma. [OJO ! no esta minificado porque esta en prueba]

```
    <script src="../Aguna-ruta/Coca.js" type="text/javascript" ></script>
```

  Vamos bien.
  
  ## Usando la pokeclass para un solo pokemon o de uso simple 
### VanillaJS
```js

    /*
      Coca se instancia sola con los nombres de variables 
      "coca" , "Coca" o "$" si no existe jquery instanciado
      
      Digamos que existe JQUERY ... utilizaremos "coca"
      
    */
    
    //igual pero mas rapido que $(document).ready(function(){});
    
    coca.ready(() => {
      //documento listo para usar ...  ES6 
    });
    
    coca.ready(function() {
      //documento listo para usar ... ES5
    });
    
  
```
