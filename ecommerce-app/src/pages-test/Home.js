// import { react } from "react";

import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import BlogCard from "../components-test/BlogCard";
import ProductCard from "../components-test/ProductCard";
import SpecialProduct from "../components-test/SpecialProduct";

const Home = () => {
    return (
        <>
            <div>
                <section className="home-wrapper-1 py-5">
                    <div className="container-xxl">
                        <div className="row">
                            <div className="col-6">
                                <div className="main-banner position-relative">
                                    <img src="images/main-banner-1.jpg" className="img-fluid rounded-3" alt="main-banner"/>
                                    <div className="main-banner-content position-absolute">
                                        <h4>SUPERCHARGED FOR PROS.</h4>
                                        <h5>iPad S13+ Pro.</h5>
                                        <p>From $999.00 <br/> or $41.62/mo.</p>
                                        <Link className="button">BUY NOW</Link>
                                    </div>
                                </div> 
                            </div>
                            <div className="col-6">
                                <div className="d-flex flex-wrap gap-10 justify-content-between align-items-center">
                                    <div className="small-banner position-relative">
                                        <img src="images/catbanner-01.jpg" className="img-fluid rounded-3" alt="main-banner"/>
                                        <div className="small-banner-content position-absolute">
                                            <h4>BEST SALE</h4>
                                            <h5>iPad S13+ Pro.</h5>
                                            <p>From $999.00 <br/> or $41.62/mo.</p>
                                        </div>
                                    </div> 

                                    <div className="small-banner position-relative">
                                        <img src="images/catbanner-02.jpg" className="img-fluid rounded-3" alt="main-banner"/>
                                        <div className="small-banner-content position-absolute">
                                            <h4>NEW ARRIVAL</h4>
                                            <h5>Buy IPad Air</h5>
                                            <p>From $999.00 <br/> or $41.62/mo.</p>
                                        </div>
                                    </div> 

                                    <div className="small-banner position-relative">
                                        <img src="images/catbanner-03.jpg" className="img-fluid rounded-3" alt="main-banner"/>
                                        <div className="small-banner-content position-absolute">
                                            <h4>NEW ARRIVAL</h4>
                                            <h5>Buy IPad Air</h5>
                                            <p>From $999.00 <br/> or $41.62/mo.</p>
                                        </div>
                                    </div> 
                        
                                    <div className="small-banner position-relative">
                                        <img src="images/catbanner-04.jpg" className="img-fluid rounded-3" alt="main-banner"/>
                                        <div className="small-banner-content position-absolute">
                                            <h4>NEW ARRIVAL</h4>
                                            <h5>Buy IPad Air</h5>
                                            <p>From $999.00 <br/> or $41.62/mo.</p>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-wrapper-2 py-5">
                    <div className="container-xxl">
                        <div className="row">
                            <div className="col-12">
                                <div className="services d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-15">
                                        <img src="images/service.png" alt="services"/>
                                        <div>
                                            <h6>Free shipping</h6>
                                            <p className="mb-0">From all orders over $5</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-15">
                                        <img src="images/service-02.png" alt="services"/>
                                        <div>
                                            <h6>Daily Surprise Offers</h6>
                                            <p className="mb-0">Save upto 25% off</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-15">
                                        <img src="images/service-03.png" alt="services"/>
                                        <div>
                                            <h6>Support 24/7</h6>
                                            <p className="mb-0">Shop with an expert</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-15">
                                        <img src="images/service-04.png" alt="services"/>
                                        <div>
                                            <h6>Affordable Prices</h6>
                                            <p className="mb-0">Get Factory Default price</p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-15">
                                        <img src="images/service-05.png" alt="services"/>
                                        <div>
                                            <h6>Secure Payments</h6>
                                            <p className="mb-0">100% Protected Payment</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-wrapper-2 py-5">
                    <div className="container-xxl">
                        <div className="row">
                            <div className="col-12">
                                <div className="categories d-flex align-items-center justify-content-between flex-wrap">
                                    <div className="d-flex align-items-center gap">
                                        <div>
                                            <h6>Cameras</h6>
                                            <p className="mb-0">10 Items</p>
                                        </div>
                                        <img src="images/camera.jpg" alt="camera"/>
                                    </div>

                                    <div className="d-flex align-items-center gap">
                                        <div>
                                            <h6>Smart Tv</h6>
                                            <p className="mb-0">10 Items</p>
                                        </div>
                                        <img src="images/tv.jpg" alt="camera"/>
                                    </div>

                                    <div className="d-flex align-items-center gap">
                                        <div>
                                            <h6>Smart Watches</h6>
                                            <p className="mb-0">10 Items</p>
                                        </div>
                                        <img src="images/watch.jpg" alt="camera"/>
                                    </div>

                                    <div className="d-flex align-items-center gap">
                                        <div>
                                            <h6>Music & Gaming</h6>
                                            <p className="mb-0">10 Items</p>
                                        </div>
                                        <img src="images/headphone.jpg" alt="camera"/>
                                    </div>
                                    
                                    <div className="d-flex align-items-center gap">
                                        <div>
                                            <h6>Music & Gaming</h6>
                                            <p className="mb-0">10 Items</p>
                                        </div>
                                        <img src="images/headphone.jpg" alt="camera"/>
                                    </div>

                                    <div className="d-flex align-items-center gap">
                                        <div>
                                            <h6>Music & Gaming</h6>
                                            <p className="mb-0">10 Items</p>
                                        </div>
                                        <img src="images/headphone.jpg" alt="camera"/>
                                    </div>

                                    <div className="d-flex align-items-center gap">
                                        <div>
                                            <h6>Music & Gaming</h6>
                                            <p className="mb-0">10 Items</p>
                                        </div>
                                        <img src="images/headphone.jpg" alt="camera"/>
                                    </div>

                                    <div className="d-flex align-items-center gap">
                                        <div>
                                            <h6>Music & Gaming</h6>
                                            <p className="mb-0">10 Items</p>
                                        </div>
                                        <img src="images/headphone.jpg" alt="camera"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                 <section className="featured-wrapper py-5 home-wrapper-2">
                    <div className="container-xxl">
                        <div className="row">
                            <div className="col-12">
                                <h3 className="section-heading">Featured Collection</h3>
                            </div>
                            <ProductCard/>
                            <ProductCard/>
                            <ProductCard/>
                            <ProductCard/>
                        </div>
                    </div>
                </section>

                <section className="famous-wrapper py-5 home-wrapper-2">
                     <div className="container-xxl">
                        <div className="row">
                            <div className="col-3">
                                <div className="famous-card position-relative">
                                    <img src="images/image-1.jpg" className="img-fluid" alt="famous"/>
                                    <div className="famous-content position-absolute">
                                        <h5>Big Screen</h5>
                                        <h6>Smart Watch Series 7</h6>
                                        <p>From $399 $16.62 for 24 mo.*</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-3">
                                <div className="famous-card position-relative">
                                    <img src="images/image-2.jpg" className="img-fluid" alt="famous"/>
                                    <div className="famous-content position-absolute">
                                        <h5 className="text-dark">Studio Display</h5>
                                        <h6 className="text-dark">600 nits of brightness.</h6>
                                        <p className="text-dark">27-inch 5k Retina display</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-3">
                                <div className="famous-card position-relative">
                                    <img src="images/image-2.jpg" className="img-fluid" alt="famous"/>
                                    <div className="famous-content position-absolute">
                                        <h5 className="text-dark">Smartphones</h5>
                                        <h6 className="text-dark">Smartphones 13 pro.</h6>
                                        <p className="text-dark">Now in green. From $999.00 or $41.62/mo. for 24 mo. Footnote*</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-3">
                                <div className="famous-card position-relative">
                                    <img src="images/image-2.jpg" className="img-fluid" alt="famous"/>
                                    <div className="famous-content position-absolute">
                                        <h5 className="text-dark">home Speakers</h5>
                                        <h6 className="text-dark">Room filling sound.</h6>
                                        <p className="text-dark">From $699 or $116.58/mo. for 12 mo.*</p>
                                    </div>
                                </div>
                            </div>                
                        </div>
                    </div>
                </section>

                <section className="special-wrapper py-5 home-wrapper-2">
                    <div className="container-xxl">
                        <div className="row">
                            <div className="col-12">
                                <h3 className="section-heading">Special Products</h3>
                            </div>
                        </div>
                        <div className="row">
                            <SpecialProduct/>
                            <SpecialProduct/>
                            <SpecialProduct/>
                            <SpecialProduct/>
                        </div>
                    </div>
                </section>

                 <section className="popular-wrapper py-5 home-wrapper-2">
                    <div className="container-xxl">
                        {/* <div className="row">
                            <div className="col-12">
                                <h3 className="section-heading">Our Popular Products</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2">
                                <div className="card"></div>
                            </div>
                        </div> */}
                        <ProductCard/>
                        <ProductCard/>
                        <ProductCard/>
                        <ProductCard/>
                    </div>
                </section>

                <section className="marque-wrapper home-wrapper py-5">
                    <div className="container-xxl">
                        <div className="row">
                            <div className="col-12">
                                <div className="marquee-inner-wrapper card-wrapper">
                                    <Marquee className="d-flex">
                                        <div className="mx-4 w-25">
                                            <img src="images/brand-01.png" alt="brand"/>
                                        </div>

                                        <div className="mx-4 w-25">
                                            <img src="images/brand-02.png" alt="brand"/>
                                        </div>

                                        <div className="mx-4 w-25">
                                            <img src="images/brand-03.png" alt="brand"/>
                                        </div>

                                        <div className="mx-4 w-25">
                                            <img src="images/brand-04.png" alt="brand"/>
                                        </div>

                                        <div className="mx-4 w-25">
                                            <img src="images/brand-05.png" alt="brand"/>
                                        </div>

                                        <div className="mx-4 w-25">
                                            <img src="images/brand-06.png" alt="brand"/>
                                        </div>

                                        <div className="mx-4 w-25">
                                            <img src="images/brand-07.png" alt="brand"/>
                                        </div>

                                        <div className="mx-4 w-25">
                                            <img src="images/brand-08.png" alt="brand"/>
                                        </div>
                                    </Marquee>
                                </div>
                            </div>
                         </div>
                     </div>
                 </section> 

                <section className="blog-wrapper py-5 home-wrapper-2">
                    <div className="container-xxl">
                        <div className="row">
                            <div className="col-12s">
                                <h3 className="section-heading">Our Lastest Blogs</h3>
                            </div>
                            <BlogCard/>
                            <BlogCard/>
                            <BlogCard/>
                            <BlogCard/>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Home;