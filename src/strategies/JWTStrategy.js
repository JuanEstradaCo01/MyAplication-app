const passportJWT = require('passport-jwt')

const JWTStrategy = passportJWT.Strategy
const extractJWT = passportJWT.ExtractJwt

const cookieExtractor = (req) => {
    const TokenEnCookie = req.cookies
    console.log({TokenEnCookie})
    return req.cookies && req.cookies.Token
    // return req.headers && req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')
  }

const JWTstrategy = new JWTStrategy({
    jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: 'jwtsecret'
  }, (jwtPayload, done) => {
    console.log( jwtPayload.user )
    done(null, jwtPayload.user)
  })

module.exports = JWTstrategy