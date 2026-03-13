function RatingStars({ rating, onRatingChange }) {
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : 'empty'}`}
          onClick={() => onRatingChange(star)}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

export default RatingStars;
