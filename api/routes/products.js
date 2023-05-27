const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
// const upload = multer({dest: './uploads'})
const storage = multer.diskStorage({
    destination: function(req, file, cb) {

        cb(null, ('./uploads'))
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname.replace(/ /g, '-'));
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
    
}
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
        fileFilter: fileFilter
    }
})

const productController = require('../controllers/products');

router.get('/', productController.get_all_product);
router.post('/', checkAuth, upload.single('productImage'), productController.create_product);
router.get('/:productId', productController.get_detail_product)
router.patch('/:productId', checkAuth, productController.update_product);
router.delete('/:productId', checkAuth,  productController.delete_product);

module.exports = router;