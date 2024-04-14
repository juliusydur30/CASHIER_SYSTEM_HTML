<?php
include('connection.php');
$action = isset($_GET['action']) ? $_GET['action'] : '';

// if user checkout
if($action === 'checkout') saveProducts();

function getProducts(){
    // get connection variable
    $conn = $GLOBALS['conn'];
    // query all products
    $stmt = $conn->prepare("SELECT * FROM products");
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // return rows
    return $rows;
}


function saveProducts(){
    $data = $_POST['data'];
    $conn = $GLOBALS['conn'];

    $total_amount = $_POST['totalAmt'];
    foreach($data as $product_id => $order_item){
        // insert to orders
        $sql = "INSERT INTO
                    `order`(product_id, quantity, total_cost)
                VALUES
                    (:product_id, :quantity, :total_cost)";

        $total_amount = $_POST['totalAmt'];
        $db_arr = [
            'product_id' => $product_id, 
            'quantity' => $order_item['orderQty'], 
            'total_cost' => $total_amount
        ];
        $stmt = $conn->prepare($sql);
        $stmt->execute($db_arr);
        
        // get cur stock
        $inv_conn = $GLOBALS['conn'];
        $stmt = $conn->prepare("
                    SELECT products.stock
                    FROM products
                    WHERE id = $product_id
        ");
        $stmt->execute();
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        $cur_stock = (int) $product['stock'];

        // update inventory qty of products
        $new_stock = $cur_stock - (int) $order_item['orderQty'];

        $sql = "UPDATE products
                SET stock=?
                Where id=?";
        $stmt = $inv_conn->prepare($sql);
        $stmt->execute([$new_stock, $product_id]);
        
    }

     // insert to transaction
     $sql = "INSERT INTO
                    payment(order_id, total_amount, tax, discount)
                VALUES
                    (:order_id, :total_amount, :tax, :discount)";
        $tax = 10.00;
        $discount = 1.00;
        $db_arr = [
            'order_id' => $order_item['name'],
            'total_amount' => $total_amount,
            'tax' => $tax,
            'discount' => $discount
           ];
        $stmt = $conn->prepare($sql);
        $stmt->execute($db_arr);
        $transaction_id = $conn->lastInsertId();


    // insert to cashier
     $sql = "INSERT INTO
                    cashier(transaction_id, date_time, first_name, last_name)
                VALUES
                    (:transaction_id, :date_time, :first_name, :last_name)";

        $first_name = 'Anthony';
        $last_name = 'Herrera';
        
        $db_arr = [
            'transaction_id' => $transaction_id,
            'date_time' => date('Y-m-d H:i:s'),
            'first_name' => $first_name,
            'last_name' => $last_name
           ];
        $stmt = $conn->prepare($sql);
        $stmt->execute($db_arr);

    var_dump($data);
}

