<?php
    include('product.php');

    $products = getProducts();
    
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ABC-Printing</title>
    <!-- bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <!-- bootstrap dialog -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap3-dialog/1.35.4/css/bootstrap-dialog.min.css" integrity="sha512-PvZCtvQ6xGBLWHcXnyHD67NTP+a+bNrToMsIdX/NUqhw+npjLDhlMZ/PhSHZN4s9NdmuumcxKHQqbHlGVqc8ow==" crossorigin="anonymous" />
    <!-- font-awesome -->
    <script src="https://use.fontawesome.com/0c7a3095b5.js"></script>
    <!-- css -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- product -->
            <div class="col-7">
                <div class="searchInputContainer">
                    <input type="text" placeholder="Search product...">
                </div>
                <div class="searchResultContainer">
                    <div class="row">
                        <!-- Going to add classes that will be use in my script
                        NOTE this are not yet pulled from the database -->
                        <?php
                            foreach ($products as $product) { ?>
                                <div class="col-4 productColContainer" data-pid="<?= $product['id']?>">
                                    <div class="productResultContainer">
                                        <img src="./images/<?= $product['img']?>" class="productImage" alt="">
                                        <div class="productInfoContainer">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <p class="productName"><?= $product['product_name']?></p>
                                                </div>
                                                <div class="col-md-4">
                                                    <p class="productPrice">₱ <?= $product['price']?>0</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <?php } ?>
                    </div>
                </div>
            </div>
            <!-- PoS -->
            <div class="col-5 posOrderContainer">
                <div class="pos_header">
                    <div class="setting alignRight">
                        <a href="javascript:void(0);"><i class="fa fa-gear"></i></a>
                    </div>
                    <p class="logo">ABC - School Supplies</p>
                    <p class="timeAndDate">XXX X, XXXX XX:XX XX</p>
                </div>
                <div class="pos_items_container">
                    <div class="pos_items">
                        <p class="itemNoData">No data</p>
                    </div>
                    <div class="item_total_container">
                        <p class="item_total">
                            <span class="item_total--label">TOTAL</span>
                            <span class="item_total--value">₱ 0.00</span>
                        </p>
                    </div>
                </div>
                <div class="checkoutBtnContainer">
                    <a href="javascript:void(0);" class="checkoutBtn">CHECKOUT</a>
                </div>
            </div>
        </div>
    </div>

<!-- create a global js variable for products -->
<script>
    let productsJson = <?= json_encode($products)?>;
    console.log(products);
    var products = {};

    // loop through products
    productsJson.forEach((product) => {
        products[product.id] = {
            name: product.product_name,
            stock: product.stock,
            price: product.price
        }
    })
</script>

<!-- js -->
<script src="script.js?v=?= time() ?>"></script>

<!-- jquery -->
<script src="js/jquery/jquery-3.7.1.min.js"></script>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- Optional theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<!-- bootstrap dialog -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap3-dialog/1.35.4/js/bootstrap-dialog.js" integrity="sha512-AZ+KX5NScHcQKWBfRXlCtb+ckjKYLO1i10faHLPXtGacz34rhXU8KM4t77XXG/Oy9961AeLqB/5o0KTJfy2WiA==" crossorigin="anonymous"></script>

</body>
</html>