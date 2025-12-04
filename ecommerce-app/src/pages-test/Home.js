// src/pages/Home.js
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import BlogCard from "../components-test/BlogCard";
import ProductCard from "../components-test/ProductCard";
import SpecialProduct from "../components-test/SpecialProduct";
import Container from "../components-test/Container";

import {
  services,
  categories,
  mainBanner,
  smallBanners,
  brands,
  famousProducts,
} from "../utils/Service";

const Home = () => {
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
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Featured Collection</h3>
          </div>
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
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
            <SpecialProduct />
            <SpecialProduct />
            <SpecialProduct />
            <SpecialProduct />
          </div>
        </div>
      </Container>

      {/* POPULAR PRODUCTS */}
      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <h3 className="section-heading">Our Popular Products</h3>
          <div className="row">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />
          </div>
        </div>
      </Container>

      {/* MARQUEE BRANDS */}
      <Container class1="marque-wrapper home-wrapper py-5">
        <div className="container-xxl">
          <div className="marquee-inner-wrapper card-wrapper">
            <Marquee className="d-flex">
              {brands.map((b, idx) => (
                <div className="mx-4 w-25" key={idx}>
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
            {[0, 1, 2, 3].map((_, i) => (
              <div className="col-3" key={i}>
                <BlogCard />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Home;
