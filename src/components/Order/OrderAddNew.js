import React, { useEffect, useState } from "react";
import "./OrderAddNew.scss";

import Select from "react-select";
import swal from "sweetalert";
import Loader from "../PageStates/Loader";
import Error from "../PageStates/Error";

function OrderAddNew() {
  const [pageState, setPageState] = useState(1);
  const [permission, setPermission] = useState(null);

  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);

  const [orderRef, setOrderRef] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [itemArray, setItemArray] = useState([
    {
      product_id: null,
      product_name: null,
      quantity: 0,
      rate: 0,
      max_stock: 0,
    },
  ]);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const [submitButtonState, setSubmitButtonState] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/verifiy_token`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        let body = await response.json();
        if (body.operation === "success") {
          fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_permission`, {
            method: "POST",
            credentials: "include",
          })
            .then(async (response) => {
              let body = await response.json();

              //console.log(JSON.parse(body.info));
              let p = JSON.parse(body.info).find((x) => x.page === "products");
              if (p.view && p.create) {
                setPermission(p);
              } else {
                window.location.href = "/unauthorized";
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          window.location.href = "/login";
        }
      })
      .catch((error) => {
        console.log(error);
      });
    getProducts();
    getCustomers();
  }, []);

  const getProducts = async (value) => {
    let result = await fetch(
      `${process.env.REACT_APP_BACKEND_ORIGIN}/getProductsExpense`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },

        credentials: "include",
      }
    );

    let body = await result.json();
    setProductList(body.info.products);
  };

  const getCustomers = async (value) => {
    let result = await fetch(
      `${process.env.REACT_APP_BACKEND_ORIGIN}/get_customers_order`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ search_value: value }),
        credentials: "include",
      }
    );

    let body = await result.json();
    setCustomerList(body.info.customers);
  };

  useEffect(() => {
    if (permission !== null) {
      setPageState(2);
    }
  }, [permission]);

  useEffect(() => {
    let temp = itemArray.reduce((p, o) => {
      return p + o.quantity * o.rate;
    }, 0);
    setGrandTotal(temp + (temp * tax) / 100);
  }, [itemArray, tax]);

  const insertOrder = async () => {
    if (orderRef === "") {
      swal("Oops!", "Order reference can't be empty", "error");
      return;
    }
    if (selectedCustomer === null) {
      swal("Oops!", "Please select a customer", "error");
      return;
    }
    if (dueDate === "") {
      swal("Oops!", "Please select a due date", "error");
      return;
    }

    let flag2 = false;
    for (let i = 0; i < itemArray.length; i++) {
      if (itemArray[i].quantity > itemArray[i].max_stock) {
        console.log(itemArray);
        swal(
          "Oops!",
          `The maximum available stock of "${itemArray[i].product_name}" is ${itemArray[i].max_stock} units`,
          "error"
        );
        flag2 = true;
        break;
      }
    }
    if (flag2) {
      return;
    }

    let flag = false;
    itemArray.forEach((obj) => {
      if (
        obj.product_id === null ||
        obj.product_name === null ||
        obj.quantity < 1 ||
        obj.rate < 1
      ) {
        flag = true;
      }
    });
    if (flag) {
      swal(
        "Oops!",
        "Please enter all item details correctly! [select a product, check quantity & rate]",
        "error"
      );
      return;
    }

    if (tax < 0) {
      swal("Oops!", "Tax can't be negative!", "error");
      return;
    }

    let obj = {};
    obj.order_reference = orderRef;
    obj.customer_id = selectedCustomer.value;
    obj.due_date = dueDate;

    let t = itemArray.map((obj) => {
      let { max_stock, ...objSpread } = obj;
      return objSpread;
    });

    obj.item_array = t;
    obj.tax = tax;
    obj.grand_total = grandTotal;

    setSubmitButtonState(true);

    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_ORIGIN}/add_order`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(obj),
        credentials: "include",
      }
    );
    let body = await response.json();

    setSubmitButtonState(false);
    //console.log(body)

    if (body.operation === "success") {
      console.log("Order created successfully");
      swal("Success!", "Order created successfully", "success");

      setOrderRef("");
      setSelectedCustomer(null);
      setDueDate("");
      setItemArray([
        { product_id: null, product_name: null, quantity: 0, rate: 0 },
      ]);
      setTax(0);
      setGrandTotal(0);
    } else {
      swal("Oops!", body.message, "error");
    }
  };

  return (
    <div className="orderaddnew">
      <div style={{ overflow: "scroll", height: "100%" }}>
        <div className="order-header">
          <div className="title">Add New Order</div>
          {/* breadcrumb */}
        </div>

        {pageState === 1 ? (
          <Loader />
        ) : pageState === 2 ? (
          <div className="card">
            <div
              className="container"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", marginTop: "5px", gap: "10px" }}>
                <div style={{ flexGrow: "1", textAlign: "center" }}>
                  <input
                    className="my_input"
                    type="text"
                    value={orderRef}
                    onChange={(e) => {
                      setOrderRef(e.target.value);
                    }}
                    placeholder="Order Reference"
                  />
                </div>
                <div style={{ flexGrow: "1" }}>
                  <Select
                    options={customerList.map((x) => {
                      return { label: x.name, value: x.customer_id };
                    })}
                    value={selectedCustomer}
                    placeholder="Select customer..."
                    onChange={(val) => {
                      setSelectedCustomer(val);
                    }}
                    onInputChange={(val) => {
                      val.length >= 1 && getCustomers(val);
                    }}
                    onMenuClose={() => {
                      setCustomerList([]);
                    }}
                    classNamePrefix="react-dropdown-dark"
                    className="dropdown-select"
                  />
                </div>
                <div style={{ flexGrow: "1", textAlign: "center" }}>
                  <input
                    className="my_input"
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ marginTop: "20px" }}>
                  {itemArray.map((obj, ind) => {
                    return (
                      <div
                        key={ind}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div style={{ flexGrow: "1" }}>
                          <label htmlFor="">Product</label>

                          <Select
                            options={productList.map((x) => {
                              return { label: x.name, value: x.product_id };
                            })}
                            value={
                              obj.product_name !== null &&
                              obj.product_id !== null
                                ? {
                                    label: obj.product_name,
                                    value: obj.product_id,
                                  }
                                : null
                            }
                            placeholder="Select a product..."
                            onChange={(val) => {
                              let t = itemArray.map((x) => {
                                return { ...x };
                              });
                              t[ind].product_id = val.value;
                              t[ind].product_name = val.label;
                              t[ind].max_stock = parseFloat(
                                productList.find(
                                  (x) => x.product_id === val.value
                                ).product_stock
                              );
                              t[ind].quantity = 1;
                              t[ind].rate = parseFloat(
                                productList.find(
                                  (x) => x.product_id === val.value
                                ).selling_price
                              );
 
                              setItemArray(t);
                            }}
                            onInputChange={(val) => {
                              val.length >= 1 && getProducts(val);
                            }}
                            onMenuClose={() => {
                              setProductList([]);
                            }}
                            classNamePrefix="react-dropdown-dark"
                          />
                        </div>
                        <div style={{ flexGrow: "1" }}>
                          <label htmlFor="">Quantity</label>

                          <input
                            className="my_input"
                            type="number"
                            value={obj.quantity.toString()}
                            onChange={(e) => {
                              let t = itemArray.map((x) => {
                                return { ...x };
                              });
                              t[ind].quantity =
                                e.target.value === ""
                                  ? 0
                                  : parseFloat(e.target.value);
                              setItemArray(t);
                            }}
                          />
                        </div>
                        <div style={{ flexGrow: "1" }}>
                          <label htmlFor="">Rate</label>

                          <input
                            className="my_input"
                            type="number"
                            value={obj.rate.toString()}
                            onChange={(e) => {
                              let t = itemArray.map((x) => {
                                return { ...x };
                              });
                              t[ind].rate =
                                e.target.value === ""
                                  ? 0
                                  : parseFloat(e.target.value);
                              setItemArray(t);
                            }}
                            disabled
                          />
                        </div>

                        <div>
                          {itemArray.length > 1 && (
                            <button
                              className="btn danger"
                              style={{ borderRadius: "3rem", width: "3rem" }}
                              onClick={() => {
                                let t = itemArray.map((x) => {
                                  return { ...x };
                                });
                                t.splice(ind, 1);
                                setItemArray(t);
                              }}
                            >
                              &#10006;
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                className="btn success"
                style={{ maxWidth: "15%", margin: " 15px 0" }}
                onClick={() => {
                  let t = itemArray.map((x) => {
                    return { ...x };
                  });
                  t.push({
                    product_id: null,
                    product_name: null,
                    quantity: 0,
                    rate: 0,
                    max_stock: 0,
                  });
                  setItemArray(t);
                }}
              >
                Add +
              </button>

              <div style={{ margin: "0 15px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    margin: "0.2rem 0",
                  }}
                >
                  <div
                    style={{ marginRight: "1rem", color: "rgb(98, 102, 100)" }}
                  >
                    <h6>Subtotal</h6>
                  </div>
                  <div style={{ width: "20%", marginRight: "8%" }}>
                    <p className="my_input">
                      {itemArray.reduce((p, o) => {
                        return p + o.quantity * o.rate;
                      }, 0)}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    margin: "0.2rem 0",
                  }}
                >
                  <div
                    style={{ marginRight: "1rem", color: "rgb(98, 102, 100)" }}
                  >
                    <h6>Tax (%)</h6>
                  </div>
                  <div style={{ width: "20%", marginRight: "8%" }}>
                    <input
                      className="my_input"
                      type="number"
                      value={tax.toString()}
                      onChange={(e) => {
                        setTax(
                          e.target.value === "" ? 0 : parseFloat(e.target.value)
                        );
                      }}
                    />
                  </div>
                </div>
                <hr style={{ width: "50%", marginLeft: "auto" }} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    margin: "0.2rem 0",
                  }}
                >
                  <div
                    style={{ marginRight: "1rem", color: "rgb(98, 102, 100)" }}
                  >
                    <h6>Grand Total</h6>
                  </div>
                  <div style={{ width: "20%", marginRight: "8%" }}>
                    <p className="my_input">{grandTotal.toFixed(3)}</p>
                  </div>
                </div>
              </div>
              {permission.create && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="btn success"
                    style={{ alignSelf: "center" }}
                    disabled={submitButtonState}
                    onClick={() => {
                      swal({
                        title: "Are you sure?",
                        text: "Please recheck all details before submitting as the order cannot be edited after creation",
                        icon: "warning",
                        buttons: true,
                      }).then((val) => {
                        if (val) {
                          insertOrder();
                        }
                      });
                    }}
                  >
                    {!submitButtonState ? (
                      <span>Submit</span>
                    ) : (
                      <span>
                        <div className="button-loader"></div>
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
}

export default OrderAddNew;
