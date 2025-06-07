/*const handleValidationError = (err,res) => {
	res.status(503).send({err})
}

const typeError = (err,req,res,next) => {
	if(err.name = 'SequelizeValidationError' || err.name == 'SequelizeUniqueConstraintError')
		handleValidationError(err);
	else res.status(500).send({ msg: 'Internal Server Error', err});
}

module.exports = { typeError }
*/

const { HttpError } = require('../errors/httpErrors');


// TODO detect unique constraint violation and return 409
const handleValidationError = (err, res) => {
 let errors = err.errors.map((el) => el.message)
 if (errors.length > 1) {
   const msgErr = errors.join(' || ')
   res.status(400).send({ messages: msgErr })
 } else {
   res.status(400).send({ messages: errors })
 }
}


const typeError = (err, req, res, next) => {
 if(err.name === "AggregateError" && err.errors?.[0]?.name === 'SequelizeBulkRecordError') {
   err = err.errors?.[0]?.errors;
 }
 if (
   err.name === 'SequelizeValidationError' ||
   err.name === 'SequelizeUniqueConstraintError'
 ) {
   return (err = handleValidationError(err, res))
 } else if(
	err instanceof HttpError
 ) {
 	console.log(err)
   res.status(err.status).send({ message: err.message })
 } else {
   res.status(500).send({ message: 'Internal Server Error', err })
 }
}

module.exports = { typeError }
