<?php
include('connection.php');

// Get the JSON data sent from JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Assuming you have a function to insert data into the payment table
function insertPayment($orderId, $totalAmount, $tax, $discount) {
    $conn = $GLOBALS['conn'];
    $stmt = $conn->prepare("INSERT INTO payment (order_id, total_amount, tax, discount) VALUES (:order_id, :total_amount, :tax, :discount)");
    $stmt->bindParam(':order_id', $orderId);
    $stmt->bindParam(':total_amount', $totalAmount);
    $stmt->bindParam(':tax', $tax);
    $stmt->bindParam(':discount', $discount);
    $stmt->execute();
    // You can return something if needed
}

// Insert payment details
insertPayment($data['order_id'], $data['total_amount'], $data['tax'], $data['discount']);
?>
