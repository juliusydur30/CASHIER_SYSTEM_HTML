<?php
include('connection.php');

// Get the JSON data sent from JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Assuming you have a function to update the stock quantity in the products table
function updateStock($productId, $newStock) {
    $conn = $GLOBALS['conn'];
    $stmt = $conn->prepare("UPDATE products SET stock = :new_stock WHERE id = :product_id");
    $stmt->bindParam(':new_stock', $newStock);
    $stmt->bindParam(':product_id', $productId);
    $stmt->execute();
    // You can return something if needed
}

// Update stock quantity
updateStock($data['id'], $data['stock']);
?>
