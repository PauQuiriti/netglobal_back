const Sequelize = require('sequelize');
let db;

if (process.env.NODE_ENV === 'production') {
  db= new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl:{
        rejectUnauthorized: false
      }
    }
  })
}
 if(process.env.NODE_ENV === 'development'){
    db = new Sequelize('NETGLOBAL', null, null, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  });
}


module.exports = db;