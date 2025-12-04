import Meta from "../components-test/Meta";
import BreadCrumb from "../components-test/BreadCrumb";
import ProductCard from "../components-test/ProductCard";
import ReactStars from "react-rating-stars-component";
import { useState } from "react";
import ReactImageZoom from "react-image-zoom";
import Color from "../components-test/Color";
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart } from "react-icons/ai";
import Container from "../components-test/Container";

const SingleProduct = () => {
    const props = {
        width: 400,
        height: 600,
        zoomWidth: 600,
        img: "https://image01-eu.oneplus.net/media/202502/11/b3c115c086af4684e803827886a183bb.png?x-amz-process=image/format,webp/quality,Q_80"
    };
    const [orderedProduct] = useState(true); // Suppression de setOrderedProduct non utilisé

    const copyToClipboard = (text) => {
        console.log("text", text);
        navigator.clipboard.writeText(text).then(() => {
            alert("Product link copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy: ", err);
            // Fallback pour les anciens navigateurs
            const textField = document.createElement("textarea");
            textField.innerText = text;
            document.body.appendChild(textField);
            textField.select();
            document.execCommand("copy");
            textField.remove();
            alert("Product link copied to clipboard!");
        });
    };

    const handleAddToCompare = (e) => {
        e.preventDefault();
        console.log("Add to compare clicked");
        // Ajouter ici la logique pour comparer le produit
    };

    const handleAddToWishlist = (e) => {
        e.preventDefault();
        console.log("Add to wishlist clicked");
        // Ajouter ici la logique pour ajouter au wishlist
    };

    const handleWriteReview = (e) => {
        e.preventDefault();
        console.log("Write review clicked");
        // Ajouter ici la logique pour écrire une review
    };

    return (
        <>
            <Meta title={"Product Name"} />
            <BreadCrumb title="Product Name" />
            <Container class1="main-product-wrapper py-5 home-wrapper-2">
                    <div className="row">
                        <div className="col-6">
                            <div className="main-product-image">
                                <div>
                                    <ReactImageZoom {...props} />
                                </div>
                            </div>
                            <div className="other-product-images d-flex flex-wrap gap-15">
                                <div>
                                    <img
                                        src="https://image01-eu.oneplus.net/media/202502/11/b3c115c086af4684e803827886a183bb.png?x-amz-process=image/format,webp/quality,Q_80"
                                        className="img-fluid"
                                        alt="watch"
                                    />
                                </div>
                                <div>
                                    <img
                                        src="https://image01-eu.oneplus.net/media/202502/11/b3c115c086af4684e803827886a183bb.png?x-amz-process=image/format,webp/quality,Q_80"
                                        className="img-fluid"
                                        alt="watch"
                                    />
                                </div>
                                <div>
                                    <img
                                        src="https://image01-eu.oneplus.net/media/202502/11/b3c115c086af4684e803827886a183bb.png?x-amz-process=image/format,webp/quality,Q_80"
                                        className="img-fluid"
                                        alt="watch"
                                    />
                                </div>
                                <div>
                                    <img
                                        src="https://image01-eu.oneplus.net/media/202502/11/b3c115c086af4684e803827886a183bb.png?x-amz-process=image/format,webp/quality,Q_80"
                                        className="img-fluid"
                                        alt="watch"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="main-product-details">
                                <div className="border-bottom">
                                    <h3 className="title">
                                        Kids Headphones Bulk 10 Pack Multi Colored For Students
                                    </h3>
                                </div>
                                <div className="border-bottom py-3">
                                    <p className="price">$ 100</p>
                                    <div className="d-flex align-items-center gap-10">
                                        <ReactStars
                                            count={5}
                                            size={24}
                                            value={4}
                                            edit={false}
                                            activeColor="#ffd700"
                                        />
                                        <p className="mb-0 t-review">( 2 Reviews )</p>
                                    </div>
                                    <button 
                                        className="review-btn border-0 bg-transparent text-decoration-underline p-0"
                                        onClick={() => document.getElementById('review').scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        Write a Review
                                    </button>
                                </div>
                                <div className="py-3">
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Type :</h3>
                                        <p className="product-data">Match</p>
                                    </div>
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Brand :</h3>
                                        <p className="product-data">Havells</p>
                                    </div>
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Category :</h3>
                                        <p className="product-data">Match</p>
                                    </div>
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Tags :</h3>
                                        <p className="product-data">Match</p>
                                    </div>
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Availability :</h3>
                                        <p className="product-data">In Stock</p>
                                    </div>
                                    <div className="d-flex gap-10 flex-column mt-2 mb-3">
                                        <h3 className="product-heading">Size :</h3>
                                        <div className="d-flex flex-wrap gap-15">
                                            <span className="badge border border-1 bg-white text-dark border-secondary">S</span>
                                            <span className="badge border border-1 bg-white text-dark border-secondary">M</span>
                                            <span className="badge border border-1 bg-white text-dark border-secondary">XL</span>
                                            <span className="badge border border-1 bg-white text-dark border-secondary">XXL</span>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-10 flex-column mt-2 mb-3">
                                        <h3 className="product-heading">Color :</h3>
                                        <Color />
                                    </div>
                                    <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                                        <h3 className="product-heading">Quantity :</h3>
                                        <div className="">
                                            <input
                                                type="number"
                                                min={1}
                                                max={10}
                                                className="form-control"
                                                style={{ width: "70px" }}
                                                defaultValue={1}
                                            />
                                        </div>
                                        <div className="d-flex align-items-center gap-30 ms-5">
                                            <button className="button border-0" type="submit">
                                                Add to Cart
                                            </button>
                                            <button className="button signup">Buy It Now</button>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-15">
                                        <div>
                                            <button 
                                                className="border-0 bg-transparent p-0 d-flex align-items-center"
                                                onClick={handleAddToCompare}
                                            >
                                                <TbGitCompare className="fs-5 me-2" /> Add to Compare
                                            </button>
                                        </div>
                                        <div>
                                            <button 
                                                className="border-0 bg-transparent p-0 d-flex align-items-center"
                                                onClick={handleAddToWishlist}
                                            >
                                                <AiOutlineHeart className="fs-5 me-2" /> Add to Wishlist
                                            </button>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-10 flex-column my-3">
                                        <h3 className="product-heading">Shipping & Returns :</h3>
                                        <p className="product-data">
                                            Free shipping and returns available on all orders! <br />
                                            We ship all US domestic orders within <b>5-10 business days!</b>
                                        </p>
                                    </div>
                                    <div className="d-flex gap-10 align-items-center my-3">
                                        <h3 className="product-heading">Product Link:</h3>
                                        <button 
                                            className="border-0 bg-transparent text-decoration-underline p-0"
                                            onClick={() => {
                                                copyToClipboard("https://image01-eu.oneplus.net/media/202502/11/b3c115c086af4684e803827886a183bb.png?x-amz-process=image/format,webp/quality,Q_80");
                                            }}
                                        >
                                            Copy Product Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </Container>
            <Container class1="description-wrapper py-5 home-wrapper-2">
                    <div className="row">
                        <div className="col-12">
                            <h4>Description</h4>
                            <div className="bg-white p-3">
                                <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                    Tenetur nisi similique illum aut perferendis voluptas, quisquam
                                    obcaecati qui nobis officia. Voluptatibus in harum deleniti
                                    labore maxime officia esse eos? Repellat?
                                </p>
                            </div>
                        </div>
                    </div>
            </Container>
            <Container class1="reviews-wrapper home-wrapper-2">
                    <div className="row">
                        <div className="col-12">
                            <h3 id="review">Reviews</h3>
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
                                            <button 
                                                className="text-dark text-decoration-underline border-0 bg-transparent p-0"
                                                onClick={handleWriteReview}
                                            >
                                                Write a Review
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="review-form py-4">
                                    <h4>Write a Reviews</h4>
                                    <form className="d-flex flex-column gap-15">
                                        <div>
                                            <ReactStars
                                                count={5}
                                                size={24}
                                                value={0}
                                                edit={true}
                                                activeColor="#ffd700"
                                            />
                                        </div>
                                        <div>
                                            <textarea
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
                                <div className="reviews mt-3">
                                    <div className="review">
                                        <div className="d-flex gap-10 align-items-center">
                                            <h6 className="mb-0">Navdeep</h6>
                                            <ReactStars
                                                count={5}
                                                size={24}
                                                value={4}
                                                edit={false}
                                                activeColor="#ffd700"
                                            />
                                        </div>
                                        <p className="mt-3">
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
            </Container>
            <Container class1="popular-wrapper py-5 home-wrapper-2">
                <div className="row">
                    <ProductCard />
                </div>
            </Container>
        </>
    );
};

export default SingleProduct;