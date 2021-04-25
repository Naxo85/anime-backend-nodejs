module.exports = (fn) => {
  // the fn funcion it's whatever function we put inside catchAsync
  return (req, res, next) => {
    //we return the value of execute that function
    fn(req, res, next).catch((err) => next(err)); // catching any error on the promise
  };
};
