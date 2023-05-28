const {logEvents} = require('./logger');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name} : ${err.message}\t${err.url}\t${req.headers.origin}`, 'errors.log');
     console.log(`Error : ${err.stack}`);

     const status = res.statusCode  ? res.statusCode:500 ; // 500 Server Error 
     res.status(status);
     res.json({message: err.message});
};

module.exports = errorHandler;