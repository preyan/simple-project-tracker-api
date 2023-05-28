const allowedOrigin = require('./allowedOrigins');

const corsOptions = {
   origin: (origin, callback) => {
        if(allowedOrigin.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
   },
    credentials: true,
    optionsSuceessStatus: 200
};

module.exports = corsOptions;