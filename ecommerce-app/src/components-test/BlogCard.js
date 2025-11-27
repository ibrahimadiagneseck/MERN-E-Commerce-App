// import { react } from "react";
import { NavLink, Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

const BlogCard = () => {
    return (
            <div className="blog-card">
                <div className="card-image">
                    <img src="images/blog-1.jpg" className="img-fluid w-100" alt="blog"/>
                </div>
                <div className="blog-content">
                    <p className="date">1 Dec, 2013</p>
                    <h5 className="title">A beautiful sunday morning renaissance</h5>
                    <p className="desc">
                        Lxxxxxxxxxxx x xxxxxxxxxx x xxx x x xxxxxxxxxxx  xxxx xxxxx xxxxxxxxx
                    </p>
                    <Link to="/" className="button">Read More</Link>
                </div>
            </div>
    )
};

export default BlogCard;