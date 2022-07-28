# netglobal_back 
*PORT:3001

                           #Informacion general
                           --------------------

*DESCRIPTION: Este repositorio corresponde al proyecto NETGLOBAL desarrollado durante el Coding BootCamp de Plaraforma5 , simulando la interaccion entre el equipo de trabajo conformado por los alumnos y un cliente. El mismo esta integrado por 3 repositorios (netglobal_back, netglobal_front y netglobal_app). 
*PROYECT DESCRIPTION: El objetivo del proyecto es desarrollar por un lado una pagina que permita a los administradores visualizar facilmente sus clientes, las sucursales de los mismos, los trabajadores disponibles (incluyendo las licensias de los vigiladores) , asignar un trabajador a una sucursal en un horario ,etc. El rproposito del equipo es generar una interfaz que facilite de esta manera el trabajo diario de quienes cumplen el rol de administrador. 
Por otro lado encontramos una app que sera utilizada por los vigiladores donde estos deberan geolocalizarse una vez que ingresen a la sucursal donde desarrollan sus tareas , debiando realizar el mismo proceso luego de cumplir su horario laboral. 
*INSTRUCCIONES: 
0) Cree la base de datos NETGLOBAL
1)Para incializar este proyecto corra el comando npm start.
2) Para conocer que tablas e indices tenemos podemos realizar la siguiente query: 
 SELECT  
      tablename,  
      indexname  
  FROM  
      pg_indexes  
  WHERE  
      schemaname = 'public'  
  ORDER BY  
      tablename,  
      indexname; 

3)Si quisiese puede seedear las tablas para probar el proyecto.
3.a- Corra el siguiente comando psql NETGLOBAL < path/to/seed
3.b- Seedee los guardias usando el archivo REST que se incluye

4) En la carpeta de routes se encuentra un archivo routes.txt con las direcciones, los parametros a enviar y la respuesta de cada ruta. 

# Backend-NetGlobal
# Backend-for-NetGlobal
