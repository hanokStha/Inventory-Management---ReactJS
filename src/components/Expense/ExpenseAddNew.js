import React, { useEffect, useState } from "react";
import "./ExpenseAddNew.scss";

import Select from "react-select";
import swal from "sweetalert";
import Loader from "../PageStates/Loader";
import Error from "../PageStates/Error";

function ExpenseAddNew() {
  const [pageState, setPageState] = useState(1);
  const [permission, setPermission] = useState(null);

  const [supplierList, setSupplierList] = useState([]);
  const [productList, setProductList] = useState([]);

  const [expenseRef, setExpenseRef] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [itemArray, setItemArray] = useState([
    { product_id: null, product_name: null, quantity: 0, rate: 0 },
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
        // console.log(body)
        if (body.operation === "success") {
          fetch(`${process.env.REACT_APP_BACKEND_ORIGIN}/get_permission`, {
            method: "POST",
            credentials: "include",
          })
            .then(async (response) => {
              let body = await response.json();

              //console.log(JSON.parse(body.info));
              let p = JSON.parse(body.info).find((x) => x.page === "expenses");
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
    getSuppliers();
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

  const getSuppliers = async (value) => {
    let result = await fetch(
      `${process.env.REACT_APP_BACKEND_ORIGIN}/get_suppliers_product`,
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
    setSupplierList(body.info.suppliers);
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

  const insertExpense = async () => {
    if (expenseRef === "") {
      swal("Oops!", "Expense reference can't be empty", "error");
      return;
    }
    if (selectedSupplier === null) {
      swal("Oops!", "Please select a supplier", "error");
      return;
    }
    if (dueDate === "") {
      swal("Oops!", "Please select a due date", "error");
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
      swal("Oops!", "please enter all item details correctly!", "error");
      return;
    }

    if (tax < 0) {
      swal("Oops!", "Tax can't be negative!", "error");
      return;
    }

    let obj = {};
    obj.expense_reference = expenseRef;
    obj.supplier_id = selectedSupplier.value;
    obj.due_date = dueDate;
    obj.item_array = itemArray;
    obj.tax = tax;
    obj.grand_total = grandTotal;

    setSubmitButtonState(true);
    console.log(obj.due_date);

    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_ORIGIN}/add_expense`,
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
      console.log("Expense created successfully");
      swal("Success!", "Expense created successfully", "success");

      setExpenseRef("");
      setSelectedSupplier(null);
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
  console.log();
  return (
    <div className="expenseaddnew">
      <div style={{ overflow: "scroll", height: "100%" }}>
        <div className="expense-header">
          <div className="title">Add New Expense</div>
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
                <div style={{ flexGrow: "1" }}>
                  <label htmlFor="">Note</label>
                  <input
                    className="my_input"
                    type="text"
                    value={expenseRef}
                    onChange={(e) => {
                      setExpenseRef(e.target.value);
                    }}
                    placeholder="Expense Reference"
                  />
                </div>
                <div style={{ flexGrow: "1" }}>
                  <label htmlFor="">Supplier</label>

                  <Select
                    options={supplierList.map((x) => {
                      return { label: x.name, value: x.supplier_id };
                    })}
                    value={selectedSupplier}
                    placeholder="Select supplier..."
                    onChange={(val) => {
                      setSelectedSupplier(val);
                    }}
                    onInputChange={(val) => {
                      val.length >= 1 && getSuppliers(val);
                    }}
                    styles={{ fontSize: "14px" }}
                    onMenuClose={() => {
                      setSupplierList([]);
                    }}
                    classNamePrefix="react-dropdown-dark"
                    className="dropdown-select"
                  />
                </div>
                <div style={{ flexGrow: "1" }}>
                  <label htmlFor="">Date</label>

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
                            obj.product_name !== null && obj.product_id !== null
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
                    style={{ alignSelf: "right", width: "fit-content" }}
                    disabled={submitButtonState}
                    onClick={() => {
                      swal({
                        title: "Are you sure?",
                        text: "Please recheck all details before submitting as the expense cannot be edited after creation",
                        icon: "warning",
                        buttons: true,
                      }).then((val) => {
                        if (val) {
                          insertExpense();
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

export default ExpenseAddNew;
