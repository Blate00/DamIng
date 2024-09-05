const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((error) => {
        console.log(error);
        res.render('error', { error });
    });
};

export default asyncHandler;
