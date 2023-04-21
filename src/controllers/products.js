export const product = async (req, res, next) => {
    const { name, price } = req.body;

    res.json({
        message: "Selamat datang di aplikasi Orlando",
        status: '200 ok',
        data: {
            name: name,
            price: price,
        }    
    });
    next();
};

export const products = async (req, res, next) => {
    res.json({
        message: "Masuk Halaman Products",
        status: '200 ok',
        data: [
            {
                name: 'Beras 5kg',
                price: '10000',
            },
            {
                name: 'Supermi',
                price: '2000',
            },
            {
                name: 'Indomie',
                price: '3000',
            },   
        ] 
    });
    next();
};