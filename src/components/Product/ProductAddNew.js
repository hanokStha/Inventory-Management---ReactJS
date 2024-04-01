import React, { useEffect, useState, useRef } from "react";
import "./ProductAddNew.scss";
import swal from "sweetalert";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Error from "../PageStates/Error";
import Loader from "../PageStates/Loader";

function ProductAddNew() {
  const [pageState, setPageState] = useState(1);
  const [permission, setPermission] = useState(null);

  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [material, setMaterial] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("0");
  const [image, setImage] = useState(null);
  const [sellingPrice, setSellingPrice] = useState("0");
  const [purchasePrice, setPurchasePrice] = useState("0");

  const [submitButtonState, setSubmitButtonState] = useState(false);

  const fileInputRef = useRef(null);
  const [imageData, setImageData] = useState(null);

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
  }, []);

  useEffect(() => {
    if (permission !== null) {
      setPageState(2);
    }
  }, [permission]);

  useEffect(() => {
    if (image) {
      let f = new FileReader();
      f.onload = (e) => {
        setImageData(e.target.result);
      };
      f.readAsDataURL(image);
    } else {
      setImageData(null);
    }
  }, [image]);

  const insertProduct = async () => {
    if (name === "") {
      swal("Oops!", "Name can't be empty", "error");
      return;
    }
    if (sellingPrice === "" || parseFloat(sellingPrice) <= 0) {
      swal("Oops!", "Selling Price can't be empty", "error");
      return;
    }
    if (purchasePrice === "" || parseFloat(purchasePrice) <= 0) {
      swal("Oops!", "Purchase Price can't be empty", "error");
      return;
    }
    if (stock < 0 || parseInt(stock) < 0) {
      swal("Oops!", "Product stock can't be negative", "error");
      return;
    }

    let f = new FormData();
    f.append("name", name);
    f.append("size", size);
    f.append("material", material);
    f.append("category", category);
    f.append("description", description);
    f.append("product_stock", parseInt(stock));
    f.append("image", image);
    f.append("selling_price", parseFloat(sellingPrice));
    f.append("purchase_price", parseFloat(purchasePrice));

    //console.log(Array.from(f.values()).map(x => x).join(", "))
    setSubmitButtonState(true);

    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_ORIGIN}/add_product`,
      {
        method: "POST",
        body: f,
        credentials: "include",
      }
    );
    let body = await response.json();

    setSubmitButtonState(false);
    //console.log(body)

    if (body.operation === "success") {
      console.log("Product created successfully");
      swal("Success!", "Product created successfully", "success");

      setName("");
      setSize("");
      setMaterial("");
      setCategory("");
      setDescription("");
      setStock("0");
      setImage(null);
      setSellingPrice("0");
      setPurchasePrice("0");
      setImageData(null);
    } else {
      swal("Oops!", body.message, "error");
    }
  };

  return (
    <div className="productaddnew">
      <div className="product-header">
        <div className="title">Add New Product</div>
        {/* breadcrumb */}
      </div>

      {pageState === 1 ? (
        <Loader />
      ) : pageState === 2 ? (
        <div className="card">
          <div className="container">
            <div className="grid-2">
              <div className="right">
                <div
                  className="row"
                  style={{ display: "flex", marginTop: "0.5rem" }}
                >
                  <div className="col">
                    <label className="fw-bold">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "flex", marginTop: "0.5rem" }}
                >
                  <div className="col">
                    <label className="fw-bold">Size</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => {
                        setSize(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col">
                    <label className="fw-bold">Material</label>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => {
                        setMaterial(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "flex", marginTop: "0.5rem" }}
                >
                  <div className="col">
                    <label className="fw-bold">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col">
                    <label className="fw-bold">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "flex", marginTop: "0.5rem" }}
                >
                  <div className="col">
                    <label className="fw-bold">Selling Price</label>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => {
                        setSellingPrice(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col">
                    <label className="fw-bold">Purchase Price</label>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => {
                        setPurchasePrice(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "flex", marginTop: "0.5rem" }}
                >
                  <div className="col">
                    <label className="fw-bold">Stock</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => {
                        setStock(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="left">
                <img
                  src={!imageData ? "/images/default_image.jpg" : imageData}
                  alt="product_image"
                  className="image-border"
                />

                <div>
                  <button
                    className="btn warning mx-1  "
                    onClick={() => {
                      fileInputRef.current.click();
                    }}
                  >
                    <p>Upload</p>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (
                        e.target.files[0].type === "image/jpeg" ||
                        e.target.files[0].type === "image/png"
                      ) {
                        setImage(e.target.files[0]);
                      } else {
                        swal(
                          "Oops!!",
                          "Unsupported File type, Please upload either .jpg,.jpeg,.png",
                          "warning"
                        );
                      }
                    }}
                  />
                  {image !== null && (
                    <button
                      className="btn danger mx-1 border-0"
                      onClick={() => {
                        setImage(null);
                      }}
                    >
                      <DeleteOutline className="" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {permission.create && (
              <div className="d-flex  ">
                <button
                  className="btn success"
                  style={{ alignSelf: "center", marginTop: "1rem" }}
                  disabled={submitButtonState}
                  onClick={() => {
                    insertProduct();
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
  );
}

export default ProductAddNew;
