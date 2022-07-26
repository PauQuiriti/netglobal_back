
 TRUNCATE admins RESTART IDENTITY CASCADE;
 TRUNCATE companies RESTART IDENTITY CASCADE;
 TRUNCATE branches RESTART IDENTITY CASCADE;
 TRUNCATE provinces RESTART IDENTITY CASCADE;
 TRUNCATE guards RESTART IDENTITY CASCADE;
 TRUNCATE assignments RESTART IDENTITY CASCADE;
 TRUNCATE inactivities RESTART IDENTITY CASCADE;

 INSERT INTO provinces (name) VALUES ('Buenos Aires');
 INSERT INTO provinces (name) VALUES ('Chaco');
 INSERT INTO provinces (name) VALUES ('Cordoba');
 INSERT INTO provinces (name) VALUES ('La Pampa');
 INSERT INTO provinces (name) VALUES ('Chubut');
 INSERT INTO provinces (name) VALUES ('Jujuy');
 INSERT INTO provinces (name) VALUES ('Salta');
 INSERT INTO provinces (name) VALUES ('Tucuman');
 INSERT INTO provinces (name) VALUES ('Formosa');
 INSERT INTO provinces (name) VALUES ('Catamarca');
 INSERT INTO provinces (name) VALUES ('Santiago del Estero');
 INSERT INTO provinces (name) VALUES ('Corrientes');
 INSERT INTO provinces (name) VALUES ('Mendoza');
 INSERT INTO provinces (name) VALUES ('Entre Rios');
 INSERT INTO provinces (name) VALUES ('Santa Fe');
 INSERT INTO provinces (name) VALUES ('Misiones');
 INSERT INTO provinces (name) VALUES ('Rio Negro');
 INSERT INTO provinces (name) VALUES ('San Juan');
 INSERT INTO provinces (name) VALUES ('San Luis');
 INSERT INTO provinces (name) VALUES ('Santa Cruz');
 INSERT INTO provinces (name) VALUES ('Neuquen');
 INSERT INTO provinces (name) VALUES ('Tierra del Fuego');
 INSERT INTO provinces (name) VALUES ('La Rioja');

INSERT INTO admins (number,street,location, "coordinateLatitude", "coordinateLength",cuil, name, "lastName", email,password,"superAdmin", image) VALUES (4400, 'Gascón','Mar del Plata', -37.99692 , -57.570185, 1,'Kobe','Bryant','nba@admin.com','$2b$10$zF21WMEseWVWg7s5dIIZhOHsEaK6a81JopzJ.URjAlD1Wm9SYPhSO',true, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMaLMskWLOR8ab_Iu1WpWbLU2_ByqbEWbnQQ&usqp=CAU');
INSERT INTO admins (number,street,location,"coordinateLatitude", "coordinateLength",cuil, name, "lastName",email,password, image) VALUES (2400,'Chaco','Mar del Plata', -37.99598  ,-57.56958 ,2,'Polly', 'Grey','polly@admin.com','$2b$10$8YbIW/tqp8SOjKq28uRh3.9IO3KBE/IlAAI1oTAwZdaZY2mhUXtCS', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBPyfsmGacVFw6JLFhwtcxYO-2qHF269JNLmpFFsK1w63kEBE1xKBORXkG3xA2Oa-zGyU&usqp=CAU');

INSERT INTO companies ("provinceId","coordinateLatitude", "coordinateLength",street, number, location, cuit, "legalName", "contractStartDate","contractEndDate",logo) VALUES ( 1,-37.99692 , -57.570185,'Gascón',4400,'Mar del Plata',12131311999, 'Havanna','2022-01-01','2022-12-01' ,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx1kLfvpglz9ro0HJsI4VoNw3CEGVlrZnXJw&usqp=CAU');
INSERT INTO companies ("provinceId","coordinateLatitude", "coordinateLength", street, number, location,cuit, "legalName", "contractStartDate","contractEndDate",logo) VALUES (1,-37.96201 , -57.56317 ,'Valencia',5888,'Mar del Plata',15131011001,'Moscuzza','2022-01-01','2022-12-01','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ5SX2cr-TiW1nODI8mV-_1XMDa5ApmnUNVw&usqp=CAU');
INSERT INTO companies ("provinceId","coordinateLatitude", "coordinateLength", street, number, location,cuit, "legalName", "contractStartDate","contractEndDate",logo) VALUES (1,-37.99598  ,-57.56958 ,'Chaco',2400,'Mar del Plata',19131001111,'Lucianos','2022-01-01','2022-05-01','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxMliX-s96Pnop4CDgkDHjxlxjJx24aUK_6A&usqp=CAU');
INSERT INTO companies ("provinceId","coordinateLatitude", "coordinateLength", street, number, location,cuit, "legalName", "contractStartDate","contractEndDate",logo) VALUES (1,-34.60815  , -58.42344,'Potosí',4060,'Buenos Aires',14111413321,'Hospital Italiano','2022-01-01','2022-12-01','https://upload.wikimedia.org/wikipedia/commons/c/c3/Hosp_italiano_logo.png?20140403193635');

INSERT INTO branches (cuit,name, street, number, location,"coordinateLatitude", "coordinateLength","companyId","provinceId") VALUES (12123230113, ' Havanna 1','calle' ,2333,'Mar del Plata',-37.99598  ,-57.56958,1,1);
INSERT INTO branches (cuit,name, street, number, location,"coordinateLatitude", "coordinateLength","companyId","provinceId") VALUES (10123230115, ' Havanna 2','Rivadavia ' , 5333,'Mar del Plata',-37.99598  ,-57.57519  ,1,1);
INSERT INTO branches (cuit,name, street, number, location,"coordinateLatitude", "coordinateLength","companyId","provinceId") VALUES (71000033208, 'Luccianos Varese ','Leandro N. Alem ' , 2427 ,'Mar del Plata',-38.0174 ,-57.52771 ,3,1);
INSERT INTO branches (cuit,name, street, number, location,"coordinateLatitude", "coordinateLength","companyId","provinceId") VALUES (19000033208, 'Luccianos Guemes ','Rawson ' , 2705 ,'Mar del Plata',-38.00692  ,-57.55443 ,3,1);
INSERT INTO branches (cuit,name, street, number, location,"coordinateLatitude", "coordinateLength","companyId","provinceId") VALUES (31000033208, 'Luccianos Inspiration Lab ','Juan B. Justo ' ,4542 ,'Mar del Plata',-38.01032 ,-57.55443 ,3,1);
INSERT INTO branches (cuit,name, street, number, location,"coordinateLatitude", "coordinateLength","companyId","provinceId") VALUES (51000033208, 'Luccianos Recoleta ','Larrea  ' , 1517 ,'Buenos Aires',-34.58918  ,-58.39796,3,1);

INSERT INTO assignments ("workedHours",date, month,  "startTime",  "endTime", notes,"branchId", "adminId", "guardId") VALUES (8,'2022-07-21',07, '2022-07-21T10:27:50.000Z','2022-07-21T18:27:50.000Z', 'Abrir ventanas', 1, 1, 1);
INSERT INTO assignments ("workedHours",date, month,  "startTime",  "endTime", notes,"branchId", "adminId", "guardId") VALUES (8,'2022-07-16',07, '2022-07-16T10:27:50.000Z','2022-07-16T16:27:50.000Z', 'Cerrar Puertas', 1, 1, 1);
INSERT INTO assignments ("workedHours",date, month,  "startTime",  "endTime", notes,"branchId", "adminId", "guardId") VALUES (8,'2022-07-30',07, '2022-07-30T10:27:50.000Z','2022-07-30T18:27:50.000Z', 'Abrir ventanas', 1, 1, 1);
INSERT INTO assignments ("state","workedHours",date, month,  "startTime",  "endTime", notes,"branchId", "adminId", "guardId") VALUES ('COMPLETED',10,'2022-07-13',07, '2022-07-13T08:27:50.000Z','2022-07-13T18:27:50.000Z', 'Abrir ventanas', 5, 1, 1);
INSERT INTO assignments ("state","workedHours",date, month,  "startTime",  "endTime", notes,"branchId", "adminId", "guardId") VALUES ('COMPLETED',10,'2022-07-11',07, '2022-07-11T08:27:50.000Z','2022-07-11T18:27:50.000Z', 'Cerrar Puertas', 5, 1, 2);
INSERT INTO assignments ("state","workedHours",date, month,  "startTime",  "endTime", notes,"branchId", "adminId", "guardId") VALUES ('COMPLETED',10,'2022-07-09',07, '2022-07-09T08:27:50.000Z','2022-07-09T18:27:50.000Z', 'Abrir ventanas', 5, 1, 1);








