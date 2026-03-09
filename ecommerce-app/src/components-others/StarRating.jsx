// Dans src/components-others/StarRating.jsx
import ReactStars from "react-rating-stars-component";

const StarRating = ({ 
  count = 5, 
  size = 24, 
  value = 0, 
  edit = false, 
  activeColor = "#ffd700",
  ...props 
}) => {
  return (
    <ReactStars
      count={count}
      size={size}
      value={value}
      edit={edit}
      activeColor={activeColor}
      {...props}
    />
  );
};

export default StarRating;