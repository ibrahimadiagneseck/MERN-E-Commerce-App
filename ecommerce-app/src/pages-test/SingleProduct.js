import Meta from "../components-test/Meta"
import BreadCrumb from "../components-test/BreadCrumb"
import ProductCard from "../components-test/ProductCard";
import ReactStars from "react-rating-stars-component";
import { useState } from "react";

const SingleProduct = () => {
    const [orderedProduct, setOrderedProduct] = useState(true);
    return (
        <>
            <Meta title={"Poduct Name"} />
            <BreadCrumb title="Poduct Name" />
            <div className="main-product-wrapper py-5 home-wrapper-2">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-6"></div>
                        <div className="col-6"></div>
                    </div>
                </div>
            </div>
            <div className="description-wrapper py-5 home-wrapper-2">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12">
                            {/* <div className="review-inner-wrapper"> */}
                            <div className="bg-white p-3">
                                <h4>Description</h4>
                                <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                    Tenetur nisi similique illum aut perferendis voluptas, quisquam
                                    obcaecati qui nobis officia. Voluptatibus in harum deleniti
                                    labore maxime officia esse eos? Repellat?
                                </p>
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <section className="reviews-wrapper py-5 home-wrapper-2">
                <div className="container-xxl">
                    <div className="row">
                        <div className="col-12">
                            <div className="review-inner-wrapper">
                                <div className="review-head d-flex justify-content-between align-items-end">
                                    <div>
                                        <h4 className="mb-2">Customer Reviews</h4>
                                        <div className="d-flex align-items-center gap-10">
                                            <ReactStars
                                                count={5}
                                                size={24}
                                                value={4}
                                                edit={false}
                                                activeColor="#ffd700"
                                            />
                                            <p className="mb-0">Based on 2 Reviews</p>
                                        </div>
                                    </div>
                                    {orderedProduct && (
                                        <div>
                                            <a className="text-dark text-decoration-underline" href="">
                                                Write a Review
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="review-form py-4">
                                    <h4>Write a Reviews</h4>
                                    <form action="" className="d-flex flex-column gap-15">
                                        <div>
                                            <ReactStars
                                                count={5}
                                                size={24}
                                                value={4}
                                                edit={true}
                                                activeColor="#ffd700"
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                name=""
                                                id=""
                                                className="w-100 form-control"
                                                cols="30"
                                                rows="4"
                                                placeholder="Comments"
                                            ></textarea>
                                        </div>
                                        <div className="d-flew justify-content-end">
                                            <button className="button border-0">Submit Review</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="reviews">
                                    <div className="review">
                                        <ReactStars
                                            count={5}
                                            size={24}
                                            value={4}
                                            edit={false}
                                            activeColor="#ffd700"
                                        />
                                        <p>
                                            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                            Tenetur nisi similique illum aut perferendis voluptas, quisquam
                                            obcaecati qui nobis officia. Voluptatibus in harum deleniti
                                            labore maxime officia esse eos? Repellat?
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="popular-wrapper py-5 home-wrapper-2">
                <div className="container-xxl">
                    <ProductCard />
                </div>
            </section>
        </>
    );
};

export default SingleProduct;