module.exports = function () {
    if (!process.env.vidly_jwtPrivateKey) {
        throw new Error('FATAL ERROR: vidly_jwtPrivateKey is not defined!');
    }

    console.log(process.env.vidly_jwtPrivateKey);
} 