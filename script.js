let script = function () {
  // store here list of order items
  this.orderItems = {};

  // store here total order amount
  this.totalOrderAmount = 0.0;
  //  lets hardcode for now the products data.
  this.products = products;

  this.showClock = function () {
    let dateObj = new Date();
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let year = dateObj.getFullYear();
    let monthNum = dateObj.getMonth();
    let dateCal = dateObj.getDate();
    let hour = dateObj.getHours();
    let min = dateObj.getMinutes();
    let sec = dateObj.getSeconds();

    let timeFormatted = loadScript.toTwelveHourFormat(hour);

    document.querySelector(".timeAndDate").innerHTML =
      months[monthNum] +
      " " +
      dateCal +
      " " +
      year +
      " " +
      timeFormatted["time"] +
      ":" +
      min +
      ":" +
      sec +
      " " +
      timeFormatted["am_pm"];

    setInterval(loadScript.showClock, 1000);
  };

  this.toTwelveHourFormat = function (time) {
    let am_pm = "AM";
    if (time > 12) {
      time = time - 12;
      am_pm = "PM";
    }
    return {
      time: time,
      am_pm: am_pm,
    };
  };

  this.registerEvents = function () {
    document.addEventListener("click", function (e) {
      let targetEl = e.target;
      let targetElClassList = targetEl.classList;

      // If click is add to order
      // User click on product images, or the product info selection
      let addToOrderClasses = ["productImage", "productName", "productPrice"];

      if (
        targetElClassList.contains("productImage") ||
        targetElClassList.contains("productName") ||
        targetElClassList.contains("productPrice")
      ) {
        // Get the product id clicked.
        let productContainer = targetEl.closest("div.productColContainer");
        let pid = productContainer.dataset.pid;
        let productInfo = loadScript.products[pid];

        // check for stock
        let curStock = productInfo["stock"];
        if (curStock === 0) {
          loadScript.dialogError("Product selected currently out of stock.");
          return a;
        }

        // Show dialog
        // Ask for quantity
        // If quantity is greater than current stock, then alert throw error
        // if quantity is not inputted throw error

        let dialogForm =
          '\
        <h6 class="dialogProductName">' +
          productInfo["name"] +
          ' <span class="floatRight">₱ ' +
          productInfo["price"] +
          '</span></h6>\
        <input type="number" id="orderQty" class="form-control" placeholder="Enter quantity..."/>\
        ';
        BootstrapDialog.confirm({
          title: "Add to Order",
          type: BootstrapDialog.TYPE_DEFAULT,
          message: dialogForm,
          callback: function (addOrder) {
            if (addOrder) {
              let orderQty = parseInt(
                document.getElementById("orderQty").value
              );
              // if user did not input quantity
              if (isNaN(orderQty)) {
                loadScript.dialogError("Please type order quantity.");
                // prevent dialog closing
                return a;
              }
              // if quantity is greater than current sock
              let curStock = productInfo["stock"];
              if (orderQty > curStock) {
                loadScript.dialogError(
                  "Quantity is higher than current stock. <strong>(" +
                    curStock +
                    ")</strong>"
                );
                // prevent dialog closing
                return a;
              }

              // all are correct.
              loadScript.addToOrder(productInfo, pid, orderQty);
            }
          },
        });
      }

      // delete order item
      if (targetElClassList.contains("deleteOrderItem")) {
        let pid = targetEl.dataset.id;
        let productInfo = loadScript.orderItems[pid];

        BootstrapDialog.confirm({
          type: BootstrapDialog.TYPE_DANGER,
          title: "<strong>Delete Order Item</strong>",
          message:
            "Are you sure to delete <strong>" +
            productInfo["name"] +
            "</strong>",
          callback: function (toDelete) {
            if (toDelete) {
              // get the quantity ordered and move it back to the main product info
              let orderedQuantity = productInfo["orderQty"];
              loadScript.products[pid]["stock"] += orderedQuantity;

              // delete items from order item
              delete loadScript.orderItems[pid];

              // refresh table or delete row
              loadScript.updateOrderItemTable();
            }
          },
        });
      }

      // update qty-decrease qty
      if (targetElClassList.contains("quantityUpdateBtn_minus")) {
        let pid = targetEl.dataset.id;

        // update product list stock - add 1
        loadScript.products[pid]["stock"]++;
        // update orderItem - orderQty - minus 1
        loadScript.orderItems[pid]["orderQty"]--;

        // update new amount
        loadScript.orderItems[pid]["amount"] =
          loadScript.orderItems[pid]["orderQty"] *
          loadScript.orderItems[pid]["price"];

        // if orderQty becomes zero, then delete from list
        if (loadScript.orderItems[pid]["orderQty"] === 0) {
          delete loadScript.orderItems[pid];
        }

        // refresh table
        loadScript.updateOrderItemTable();
      }

      // update qty-increase qty
      if (targetElClassList.contains("quantityUpdateBtn_plus")) {
        let pid = targetEl.dataset.id;

        // check if stock is empty.
        // show alert
        if (loadScript.products[pid]["stock"] === 0) {
          loadScript.dialogError("Product is out of stock.");
        } else {
          // update product list stock - minus 1
          loadScript.products[pid]["stock"]--;

          // update orderItem - orderQty - plus 1
          loadScript.orderItems[pid]["orderQty"]++;

          // update new amount
          loadScript.orderItems[pid]["amount"] =
            loadScript.orderItems[pid]["orderQty"] *
            loadScript.orderItems[pid]["price"];

          // refresh table
          loadScript.updateOrderItemTable();
        }
      }

      // checkout
      if (targetElClassList.contains("checkoutBtn")) {
        // check if order item is empty
        // alert dialog

        if (Object.keys(loadScript.orderItems).length) {
          // display items
          // total amount

          let orderItemsHtml = "";
          let counter = 1;
          let totalAmt = 0.0;
          for (const [pid, orderItem] of Object.entries(
            loadScript.orderItems
          )) {
            orderItemsHtml +=
              '\
            <div class="row checkoutTblContentContainer">\
              <div class="col-md-2 checkoutTblContent">' +
              counter +
              '</div>\
              <div class="col-md-4 checkoutTblContent">' +
              orderItem["name"] +
              '</div>\
              <div class="col-md-3 checkoutTblContent">' +
              loadScript.addCommas(orderItem["orderQty"]) +
              '</div>\
              <div class="col-md-3 checkoutTblContent">₱ ' +
              loadScript.addCommas(orderItem["amount"].toFixed(2)) +
              "</div>\
            </div>";
            totalAmt += orderItem["amount"];
            counter++;
          }

          // Calculate tax and discount
          const taxRate = 0.1; // 10% tax rate
          const discountRate = 0.01; // 1% discount rate

          const taxAmount = totalAmt * taxRate;
          const discountAmount = totalAmt * discountRate;

          // Apply tax and discount to the total amount
          const totalAmountWithTax = totalAmt + taxAmount;
          const finalTotalAmount = totalAmountWithTax - discountAmount;

          let content =
            '\
          <div class="row">\
            <div class="col-md-7">\
              <p class="checkoutTblHeaderContainer_title">Items</p>\
              <div class="row checkoutTblHeaderContainer">\
              <div class="col-md-2 checkoutTblHeader">#</div>\
              <div class="col-md-4 checkoutTblHeader">Product Name</div>\
              <div class="col-md-3 checkoutTblHeader">Ordered Qty</div>\
              <div class="col-md-3 checkoutTblHeader">Amount</div>\
              </div>' +
            orderItemsHtml +
            '\
            </div>\
            <div class="col-md-5">\
              <div class="checkoutTotalAmountContainer">\
              <span class="checkout_amt">+' +
            loadScript.addCommas(taxAmount.toFixed(2)) +
            '</span> <br/>\
              <span class="checkout_amt_title">TAX (10%)</span>\
              </div>\
              <div class="checkoutTotalAmountContainer">\
              <span class="checkout_amt">-' +
            loadScript.addCommas(discountAmount.toFixed(2)) +
            '</span> <br/>\
              <span class="checkout_amt_title">DISCOUNT (1%)</span>\
              </div>\
              <div class="checkoutTotalAmountContainer">\
              <span class="checkout_amt">' +
            loadScript.addCommas(finalTotalAmount.toFixed(2)) +
            '</span> <br/>\
              <span class="checkout_amt_title">TOTAL AMOUNT</span>\
              </div>\
            </div>\
          </div>';

          BootstrapDialog.confirm({
            type: BootstrapDialog.TYPE_INFO,
            title: "<strong>CHECKOUT</strong>",
            cssClass: "checkoutDialog",
            message: content,
            btnOKLabel: "Checkout",
            callback: function (checkout) {
              if (checkout) {
                // Save to database
                $.post(
                  "product.php?action=checkout",
                  {
                    data: loadScript.orderItems,
                    totalAmt: loadScript.totalOrderAmount,
                  },
                  function (response) {},
                  "json"
                );
              }
            },
          });
        }
      }
    });
  };

  this.updateOrderItemTable = function () {
    // reset to zero total
    loadScript.totalOrderAmount = 0.0;
    // refresh order list table.
    let orderContainer = document.querySelector(".pos_items");
    let html = '<p class=itemNoData">No data</p>';

    // check if order items is empty or not
    if (Object.keys(loadScript.orderItems)) {
      let tableHtml =
        '<table class="table table-striped" id="pos_items_tbl">' +
        "<thead>" +
        "<tr>" +
        "<th>#</th>" +
        "<th>PRODUCT</th>" +
        "<th>PRICE</th>" +
        "<th>QTY</th>" +
        "<th>AMOUNT</th>" +
        "<th></th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>__ROWS__</tbody>" +
        "</table>";

      // loop order items and store in rows.
      let rows = "";
      let rowNum = 1;
      for (const [pid, orderItem] of Object.entries(loadScript.orderItems)) {
        rows += `
          <tr>
            <td>${rowNum}</td>
            <td>${orderItem["name"]}</td>
            <td>₱ ${loadScript.addCommas(orderItem["price"])}</td>
            <td>${loadScript.addCommas(orderItem["orderQty"])}
              <a href="javascript:void(0);" data-id="${pid}" class="quantityUpdateBtn quantityUpdateBtn_minus">
                <i class="fa fa-minus quantityUpdateBtn quantityUpdateBtn_minus" data-id="${pid}"></i>
              </a>

              <a href="javascript:void(0);" data-id="${pid}" class="quantityUpdateBtn quantityUpdateBtn_plus">
                <i class="fa fa-plus quantityUpdateBtn quantityUpdateBtn_plus" data-id="${pid}"></i>
              </a>
            </td>
            <td>₱ ${loadScript.addCommas(orderItem["amount"].toFixed(2))}</td>
            <td>
              <a href="javascript:void(0);"><i class="fa fa-edit"></i></a>
              <a href="javascript:void(0);" class="deleteOrderItem" data-id="${pid}"><i class="fa fa-trash deleteOrderItem" data-id="${pid}"></i></a>
            </td>
          </tr>
        `;
        rowNum++;

        loadScript.totalOrderAmount += orderItem["amount"];
      }
      html = tableHtml.replace("__ROWS__", rows);
    }

    // append to order list table
    orderContainer.innerHTML = html;

    loadScript.updateTotalOrderAmount();
  };

  this.updateTotalOrderAmount = function () {
    // update total amount
    document.querySelector(".item_total--value").innerHTML =
      "₱ " + loadScript.addCommas(loadScript.totalOrderAmount.toFixed(2));
  };

  // format number
  this.formatNum = function (num) {
    if (isNaN(num) || num === undefined) num = 0.0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // add comma
  this.addCommas = function (nStr) {
    nStr += "";
    var x = nStr.split(",");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  };

  this.addToOrder = function (productInfo, pid, orderQty) {
    // check current orders (store in variable)
    let curItemsIds = Object.keys(loadScript.orderItems);
    let totalAmount = productInfo["price"] * orderQty;

    // check if it's already added
    if (curItemsIds.indexOf(pid) > -1) {
      // if added, just update the quantity (add qty), and price
      loadScript.orderItems[pid]["amount"] += totalAmount;
      loadScript.orderItems[pid]["orderQty"] += orderQty;
    } else {
      // else, add directly
      loadScript.orderItems[pid] = {
        name: productInfo["name"],
        price: productInfo["price"],
        orderQty: orderQty,
        amount: totalAmount,
      };
    }
    // update quantity to the productInfo
    loadScript.products[pid]["stock"] -= orderQty;

    this.updateOrderItemTable();

    // refresh the products variable (updated stock)
  };

  this.dialogError = function (message) {
    BootstrapDialog.alert({
      title: "<strong>Error</strong>",
      type: BootstrapDialog.TYPE_DANGER,
      message: message,
    });
  };

  this.initialize = function () {
    // Run clock
    this.showClock();

    // Register all app events - click, change, etc...
    this.registerEvents();
  };
};

let loadScript = new script();
loadScript.initialize();
