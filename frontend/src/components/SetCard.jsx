  import { useState } from 'react';
  import RatingStars from './RatingStars';

  function SetCard({ set, currentUsername, onRate, onDelete }) {
    const userRating = set.ratings.find((r) => r.username === currentUsername);
    const [localRating, setLocalRating] = useState(userRating?.rating || 0);
    const [hasListened, setHasListened] = useState(userRating?.has_listened === 1);

    const handleRatingChange = (rating) => {
      setLocalRating(rating);
      onRate(set.id, rating, hasListened);
    };

    const handleListenedChange = (checked) => {
      setHasListened(checked);
      if (localRating > 0) {
        onRate(set.id, localRating, checked);
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const getSentiment = () => {
      if (!set.avg_rating) return 'No ratings yet';
      if (set.avg_rating >= 4.5) return '🔥 Fire!';
      if (set.avg_rating >= 4.0) return '✨ Excellent';
      if (set.avg_rating >= 3.5) return '👍 Good';
      if (set.avg_rating >= 3.0) return '😐 Okay';
      return '👎 Not great';
    };

    return (
      <div className="set-card">
        <div className="set-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h3>{set.title}</h3>
              <div className="set-meta">
                Posted by <strong>{set.posted_by}</strong> on {formatDate(set.posted_at)}
              </div>
            </div>
            <button
              onClick={() => onDelete(set.id)}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <a
          href={set.soundcloud_url}
          target="_blank"
          rel="noopener noreferrer"
          className="soundcloud-link"
        >
          🎧 Listen on SoundCloud
        </a>

        {set.avg_rating && (
          <div className="sentiment-bar">
            <h4>Overall Sentiment: {getSentiment()}</h4>
            <div className="sentiment-stats">
              <div className="stat">
                <span className="stat-label">Average Rating:</span>
                <span className="stat-value">{set.avg_rating} ⭐</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Ratings:</span>
                <span className="stat-value">{set.total_ratings}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Listened:</span>
                <span className="stat-value">{set.listened_count} people</span>
              </div>
            </div>
          </div>
        )}

        <div className="rating-section">
          <h4>Your Rating</h4>
          <div className="rating-controls">
            <RatingStars rating={localRating} onRatingChange={handleRatingChange} />
            <label className="listened-checkbox">
              <input
                type="checkbox"
                checked={hasListened}
                onChange={(e) => handleListenedChange(e.target.checked)}
              />
              <span>I've listened to this set</span>
            </label>
          </div>
        </div>

        {set.ratings.length > 0 && (
          <div className="ratings-list">
            <h4>All Ratings ({set.ratings.length})</h4>
            {set.ratings.map((rating, idx) => (
              <div key={idx} className="rating-item">
                <span className="rating-item-user">{rating.username}</span>
                <div className="rating-item-details">
                  <span className="rating-item-stars">
                    {'⭐'.repeat(rating.rating)}
                  </span>
                  {rating.has_listened === 1 && (
                    <span className="rating-item-listened">✓ Listened</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  export default SetCard;
