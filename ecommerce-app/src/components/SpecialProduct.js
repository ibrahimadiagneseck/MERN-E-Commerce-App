// import { react } from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import watch from "../images/watch.jpg";

const SpecialProduct = (props) => {

    const { id, brand, title, totalrating, price, sold, quantity } = props;

    const ratingValue = totalrating ? (typeof totalrating === 'string' ? parseFloat(totalrating) : Number(totalrating)) : 0;

    // sold = 30
    // quantity = 70
    // total = 100
    // percent = 30
    const total = sold + quantity;
    const percent = total === 0 ? 0 : (sold / total) * 100; // division par 0



    return (
        <div className="col-6 mb-3">
            <div className="special-product-card">
                <div className="d-flex justify-content-between">
                    <div className="d-flex justify-content-between">
                        <img src={watch} className="img-fluid" alt="watch"/>
                    </div>
                    <div className="special-product-content">
                        <h5 className="brand">{brand}</h5>
                        <h6 className="title">
                            { title }
                        </h6>
                        <ReactStars
                            count={5}
                            size={24}
                            value={ratingValue}
                            edit={false}
                            activeColor="#ffd700"
                        />
                        <p className="price">
                            <span className="red-p">$ {price}</span> 
                            {/* &nbsp; <strike>$200</strike> */}
                        </p>
                        <div className="discount-till d-flex align-items-center gap-10">
                            <p className="mb-0">
                                <b>5 </b>days
                            </p>
                            <div className="d-flex gap-10 align-items-center">
                                <span className="badge rounded-circle p-2 bg-danger">1</span>:
                                <span className="badge rounded-circle p-2 bg-danger">1</span>:
                                <span className="badge rounded-circle p-2 bg-danger">1</span>
                            </div>
                        </div>
                        <div className="prod-count my-3">
                            <p>Products: {quantity}</p>
                            <div className="progress">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${percent}%` }}
                                    aria-valuenow={percent}
                                    aria-valuemin={0}
                                    aria-valuemax={total}
                                    >
                                </div>
                            </div>
                        </div>
                        <Link className="button" to={'/product/' + id}>View</Link>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default SpecialProduct;