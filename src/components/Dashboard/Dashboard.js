import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import Feature from "./Features/Feature";
import Chart from "./chart/Chart";
import Loader from "../PageStates/Loader";
import Error from "../PageStates/Error";

function Dashboard() {
  const [pageState, setPageState] = useState(1);
  const [permission, setPermission] = useState(null);

  const [reportStats, setReportStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [graphStats, setGraphStats] = useState(null);

  const [productGenderP, setProductGenderP] = useState([]);

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

              let p = JSON.parse(body.info).find((x) => x.page === "dashboard");
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
    getReportStats();
    getProductStats();
    getGraphStats();
  }, []);

  const getReportStats = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_BACKEND_ORIGIN}/get_report_stats`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    let body = await result.json();
    setReportStats(body.info);
  };

  const getProductStats = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_BACKEND_ORIGIN}/get_product_stats`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    let body = await result.json();
    setProductStats(body.info);
  };

  const getGraphStats = async () => {
    let result = await fetch(
      `${process.env.REACT_APP_BACKEND_ORIGIN}/get_graph_stats`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    let body = await result.json();
    setGraphStats(body.info);
  };

  useEffect(() => {
    if (permission !== null) {
      let p1 = getReportStats();
      let p2 = getProductStats();
      let p3 = getGraphStats();

      Promise.all([p1, p2, p3])
        .then(() => {
          setPageState(2);
        })
        .catch((err) => {
          console.log(err);
          setPageState(3);
        });
    }
  }, [permission]);

  useEffect(() => {
    if (productStats != null) {
      let data = productStats[2];
      let total = data.reduce((p, o) => {
        return p + o.count;
      }, 0);

      let t = data.map((x) => {
        let temp = { ...x };
        temp["percentage"] = (temp.count * 100) / total;
        return temp;
      });
      setProductGenderP(t);
    }
  }, [productStats]);

  return (
    <div className="dashboard">
      <div style={{ overflow: "scroll", height: "100%" }}>
        {pageState === 1 ? (
          <Loader />
        ) : pageState === 2 ? (
          <>
            <Feature reportStats={reportStats} />
            <div className="second_panel">
              <div className="left">
                <div className="title">PRODUCT DETAILS</div>
                <hr className="my-1" style={{ color: "darkgrey" }} />
                <div className="itme_stats">
                  <div style={{ flex: "1" }}>
                    <div className="row mb-1">
                      <div className="col-9">Total Number of Items:</div>
                      <div className="col-3 fw-bold">
                        {productStats[0]?.total_products}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 text-danger">Low Stock Items:</div>
                    </div>
                    {productStats[1]?.map((x, i) => {
                      return (
                        <div key={i} className="row">
                          <div className="col-9">&bull; {x.name}</div>
                          <div className="col-3 fw-bold">{x.product_stock}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="title">TOP SELLING ITEMS</div>
                <hr className="my-1" style={{ color: "darkgrey" }} />
                <div style={{ overflowX: "auto" }}>
                  <div className="d-flex gap-1">
                    {productStats[3].map((x, i) => {
                      return (
                        <div key={i} className="card-items">
                          {x.image === null ? (
                            <div
                              className="d-flex align-items-center fs-5 text-center"
                              style={{ height: "80%" }}
                            >
                              No image available
                            </div>
                          ) : (
                            <img
                              style={{ height: "80%", borderRadius: "5px" }}
                              src={`${process.env.REACT_APP_BACKEND_ORIGIN}/uploads/${x.image}`}
                              alt="product"
                            />
                          )}
                          <div
                            className="text-center fw-bold"
                            style={{ fontSize: "small" }}
                            title={x.name}
                          >
                            {x.name.length > 20
                              ? x.name.slice(0, 20) + "..."
                              : x.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <Chart graphStats={graphStats} />
          </>
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
