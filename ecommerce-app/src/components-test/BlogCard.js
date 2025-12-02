// import { react } from "react";
import { Link } from "react-router-dom";
// import { BsSearch } from "react-icons/bs";
import blog1 from "../images/blog-1.jpg";

const BlogCard = () => {
    return (
            <div className="blog-card">
                <div className="card-image">
                    <img src={blog1}  className="img-fluid w-100" alt="blog"/>
                </div>
                <div className="blog-content">
                    <p className="date">1 Dec, 2013</p>
                    <h5 className="title">A beautiful sunday morning renaissance</h5>
                    <p className="desc">
                        Lxxxxxxxxxxx x xxxxxxxxxx x xxx x x xxxxxxxxxxx  xxxx xxxxx xxxxxxxxx
                    </p>
                    <Link to="/blog/:id" className="button">Read More</Link>
                </div>
            </div>
    )
};

export default BlogCard;