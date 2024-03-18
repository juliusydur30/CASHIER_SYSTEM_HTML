<?php
include('connection.php');

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
?>