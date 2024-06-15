// taking to dataBASE will be there countinously in terms of user , videos ,writing the |dataBASE connection code| is BAD PRACTICES

// TO tackle that we use utility file
// | Higher Order function |

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
  };
  
  
  
  export { asyncHandler };