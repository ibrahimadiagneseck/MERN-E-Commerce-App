// src/pages/Home.js
import Marquee from "react-fast-marquee";
import { Link, useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import SpecialProduct from "../components/SpecialProduct";
import Container from "../components-others/Container";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import watchImage from "../images/watch.jpg"; 
import moment from "moment"; 

import ReactStars from "react-rating-stars-component";
import wishIcon from "../images/wish.svg";
import prodcompareIcon from "../images/prodcompare.svg";
import viewIcon from "../images/view.svg";
import addcartIcon from "../images/add-cart.svg";
import { addToWishlist, getAllProducts } from "../features/products/productSlice";
import {
  services,
  categories,
  mainBanner,
  smallBanners,
  brands,
  famousProducts,
} from "../utils/Service";

const Home = () => {

  const navigate = useNavigate();

  const addToWishList = (id) => {
      dispatch(addToWishlist(id));
  };

  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state?.product?.products);

  const dispatch = useDispatch();

  useEffect(() => {

    const getBlogs = () => {
      dispatch(getAllBlogs());
    };
    const getProducts = () => {
      dispatch(getAllProducts());
    };

    getBlogs();
    getProducts();

  }, [dispatch]);

  const blogs = blogState && Array.isArray(blogState) ? blogState : [];
  const products = productState && Array.isArray(productState) ? productState : [];

  const getImageUrl = (item, index) => {

    if (!item?.images || !Array.isArray(item.images)) {
      return index === 0 ? watchImage : watchImage;
    }

    if (item.images.length > index) {
      if (item.images[index]?.url) {
        return item.images[index].url;
      }
      if (typeof item.images[index] === 'string') {
        return item.images[index];
      }
    }

    return index === 0 ? watchImage : watchImage;
  };


  return (
    <>
      {/* MAIN BANNER */}
      <Container class1="home-wrapper-1 py-5">
        <div className="row">
          <div className="col-6">
            <div className="main-banner position-relative">
              <img src={mainBanner.image} className="img-fluid rounded-3" alt="main-banner" />
              <div className="main-banner-content position-absolute">
                <h4>SUPERCHARGED FOR PROS.</h4>
                <h5>{mainBanner.title}</h5>
                <p dangerouslySetInnerHTML={{ __html: mainBanner.tagline }} />
                <Link className="button">BUY NOW</Link>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="d-flex flex-wrap gap-10 justify-content-between align-items-center">
              {smallBanners.map((b, i) => (
                <div className="small-banner position-relative" key={i}>
                  <img src={b.image} className="img-fluid rounded-3" alt={`banner-${i}`} />
                  <div className="small-banner-content position-absolute">
                    <h4>{/* category label can be added here if needed */}</h4>
                    <h5>{b.title}</h5>
                    <p dangerouslySetInnerHTML={{ __html: b.tagline }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* SERVICES */}
      <Container class1="home-wrapper-1 py-5">
        <div className="row">
          <div className="col-12">
            <div className="services d-flex align-items-center justify-content-between">
              {services.map((s, idx) => (
                <div className="d-flex align-items-center gap-15" key={idx}>
                  <img src={s.image} alt={s.title} />
                  <div>
                    <h6>{s.title}</h6>
                    <p className="mb-0">{s.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* CATEGORIES */}
      <Container class1="home-wrapper-1 py-5">
        <div className="row">
          <div className="col-12">
            <div className="categories d-flex align-items-center justify-content-between flex-wrap">
              {categories.map((c, idx) => (
                <div className="d-flex align-items-center gap" key={idx}>
                  <div>
                    <h6>{c.title}</h6>
                    <p className="mb-0">{c.tagline}</p>
                  </div>
                  <img src={c.image} alt={c.title} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* FEATURED COLLECTION */}
      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <h3 className="section-heading">Featured Collection</h3>
        <div className="row">
            {products && products.length > 0 ? (
              products.map((item, index) => {
                if (item.tags.includes("featured")) {
                  // Convertir totalrating en nombre pour ReactStars
                const ratingValue = item?.totalrating ? 
                    (typeof item.totalrating === 'string' ? 
                        parseFloat(item.totalrating) : 
                        Number(item.totalrating)) 
                    : 0;

                  return (
                    <div
                      key={item?._id || index}
                      className="col-3"
                    >
                      <div className="product-card position-relative">
                        <div className="wishlist-icon position-absolute">
                          <button
                            className="border-0 bg-transparent"
                            onClick={(e) => {
                              e.preventDefault(); // empêche le rechargement de la page // Prevent link navigation
                              addToWishList(item?._id);
                            }}
                          >
                            <img src={wishIcon} alt="wishlist" />
                          </button>
                        </div>
                        <div className="product-image">
                          <img
                            src={getImageUrl(item, 0)}
                            className="img-fluid mx-auto"
                            width={160}
                            alt={item?.title || "product"}
                          />
                          <img
                            src={getImageUrl(item, 1)}
                            className="img-fluid mx-auto"
                            width={160}
                            alt={item?.title || "product"}
                          />
                        </div>
                        <div className="product-details">
                          <h6 className="brand">{item?.brand || "Unknown Brand"}</h6>
                          <h5 className="product-title">
                            {item?.title || "Product Title"}
                          </h5>
                          <ReactStars
                            count={5}
                            size={24}
                            value={ratingValue}
                            edit={false}
                            activeColor="#ffd700"
                          />

                          <p className="price">${item?.price || "0.00"}</p>
                        </div>
                        <div className="action-bar position-absolute">
                          <div className="d-flex flex-column gap-15">
                            <button className="border-0 bg-transparent">
                              <img src={prodcompareIcon} alt="compare" />
                            </button>
                          </div>
                          <div className="d-flex flex-column">
                            <button className="border-0 bg-transparent">
                              <img onClick={() => navigate("/product/" + item?._id)} src={viewIcon} alt="view" />
                            </button> 
                          </div>
                          <div className="d-flex flex-column">
                            <button className="border-0 bg-transparent">
                              <img src={addcartIcon} alt="addcart" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null; // Important: retourner null pour les autres éléments
              })
            ) : (
              <p>No products available</p>
            )}
          </div>
      </Container>

      {/* FAMOUS PRODUCTS */}
      <Container class1="famous-wrapper py-5 home-wrapper-2">
        <div className="row">
          {famousProducts.map((fp, i) => (
            <div className="col-3" key={i}>
              <div className="famous-card position-relative">
                <img src={fp.image} className="img-fluid" alt={fp.title} />
                <div className="famous-content position-absolute">
                  <h5 className="text-dark">{fp.title}</h5>
                  <h6 className="text-dark">{fp.tagline}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* SPECIAL PRODUCTS */}
      <Container class1="special-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <h3 className="section-heading">Special Products</h3>
          <div className="row">
            {products && products.length > 0 ? (
              products.map((item, index) => {
                if (item.tags.includes("special")) {
                  return <SpecialProduct 
                    key={index}
                    id={item?._id}
                    brand={item?.brand}
                    title={item?.title}
                    totalrating={item?.totalrating.toString()}
                    price={item?.price}
                    sold={item?.sold}
                    quantity={item?.quantity}
                  />;
                }
                return null; // Important: retourner null pour les autres éléments
              })
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </Container>

      {/* POPULAR PRODUCTS */}
      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <h3 className="section-heading">Our Popular Products</h3>
          <div className="row">
            {products && products.length > 0 ? (
              products.map((item, index) => {
                if (item.tags.includes("popular")) {

                  // Convertir totalrating en nombre pour ReactStars
                const ratingValue = item?.totalrating ? 
                    (typeof item.totalrating === 'string' ? 
                        parseFloat(item.totalrating) : 
                        Number(item.totalrating)) 
                    : 0;

                  return (
                    <div
                      key={item?._id || index}
                      className="col-3"
                    >
                      <div className="product-card position-relative">
                        <div className="wishlist-icon position-absolute">
                          <button
                            className="border-0 bg-transparent"
                            onClick={(e) => {
                              e.preventDefault(); // empêche le rechargement de la page // Prevent link navigation
                              addToWishList(item?._id);
                            }}
                          >
                            <img src={wishIcon} alt="wishlist" />
                          </button>
                        </div>
                        <div className="product-image">
                          <img
                            src={getImageUrl(item, 0)}
                            className="img-fluid mx-auto"
                            width={160}
                            alt={item?.title || "product"}
                          />
                          <img
                            src={getImageUrl(item, 1)}
                            className="img-fluid mx-auto"
                            width={160}
                            alt={item?.title || "product"}
                          />
                        </div>
                        <div className="product-details">
                          <h6 className="brand">{item?.brand || "Unknown Brand"}</h6>
                          <h5 className="product-title">
                            {item?.title || "Product Title"}
                          </h5>
                          <ReactStars
                            count={5}
                            size={24}
                            value={ratingValue}
                            edit={false}
                            activeColor="#ffd700"
                          />

                          <p className="price">${item?.price || "0.00"}</p>
                        </div>
                        <div className="action-bar position-absolute">
                          <div className="d-flex flex-column gap-15">
                            <button className="border-0 bg-transparent">
                              <img src={prodcompareIcon} alt="compare" />
                            </button>
                          </div>
                          <div className="d-flex flex-column">
                            <button className="border-0 bg-transparent">
                              <img onClick={() => navigate("/product/" + item?._id)} src={viewIcon} alt="view" />
                            </button>
                          </div>
                          <div className="d-flex flex-column">
                            <button className="border-0 bg-transparent">
                              <img src={addcartIcon} alt="addcart" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null; // Important: retourner null pour les autres éléments
              })
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      </Container>

      {/* MARQUEE BRANDS */}
      <Container class1="marque-wrapper home-wrapper py-5">
        <div className="container-xxl">
          <div className="marquee-inner-wrapper card-wrapper">
            <Marquee className="d-flex">
              {brands.map((b, id) => (
                <div className="mx-4 w-25" key={id}>
                  <img src={b.image} alt={b.title} />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </Container>

      {/* BLOGS */}
      <Container class1="blog-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <h3 className="section-heading">Our Latest Blogs</h3>
          <div className="row">
            {/* {[0, 1, 2, 3].map((_, i) => (
              <div className="col-3" key={i}>
                <BlogCard />
              </div>
            ))} */}

            {
              blogs?.slice(0, 4).map((item, index) => (
                <div className="col-3" key={index}>
                  <BlogCard
                    id={item?._id}
                    title={item?.title}
                    description={item?.description}
                    image={getImageUrl(item, 0)}
                    date={moment(item?.createdAt).format("MMMM Do YYYY, h:mm a")}
                  />
                </div>
              ))

            }
          </div>
        </div>
      </Container>
    </>
  );
};

export default Home;
