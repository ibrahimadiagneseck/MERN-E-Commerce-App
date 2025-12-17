// import { react } from "react";

import BreadCrumb from "../components/BreadCrumb";
import Container from "../components-others/Container";
import Meta from "../components/Meta";
import cross from "../images/cross.svg";
import watch from "../images/watch.jpg";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProductWishlist } from "../features/user/userSlice";



const Wishlist = () => {

    const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

    const dispatch = useDispatch();

    useEffect(() => {
        const getWishlist = () => {
            dispatch(getUserProductWishlist());
        };

        getWishlist();
    }, [dispatch]);

    // Fonction pour obtenir l'URL d'une image de manière sécurisée
        const getImageUrl = (item, index) => {
            if (!item?.images || !Array.isArray(item.images)) {
                // Retourner des images par défaut si pas d'images
                return index === 0 ? watch : watch;
            }
            
            if (item.images.length > index) {
                // Si l'image a une propriété url
                if (item.images[index]?.url) {
                    return item.images[index].url;
                }
                // Si l'image est une string directement
                if (typeof item.images[index] === 'string') {
                    return item.images[index];
                }
            }
            
            // Retourner des images par défaut
            return index === 0 ? watch : watch;
        };

    return (
        <>
            <Meta title="Wishlist" />
            <BreadCrumb title="Wishlist" />
            <Container className="wishlist-wrapper home-wrapper-2 py-5">
                <div className="row">
                    {
                        wishlistState?.map((item, index) => {
                            return (
                                <div className="col-3" key={index}>
                                    <div className="wishlist-card position-relative">
                                        <img src={cross} alt="cross" className="position-absolute cross img-fluid" />
                                        <div className="wishlist-card-image bg-white">
                                            <img src={getImageUrl(item, 0)}  className="img-fluid d-block mx-auto" width={160} alt="watch" />
                                        </div>
                                        <div className="py-3 px-3">
                                            <h5 className="title">
                                                { item?.title }
                                            </h5>
                                            <h6 className="price">$ { item?.price }</h6>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Container>
        </>
    );
};


export default Wishlist;