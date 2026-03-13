import { useState } from 'react';

function AddSetForm({ onAddSet }) {
  const [soundcloudUrl, setSoundcloudUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!soundcloudUrl.trim() || !title.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const success = await onAddSet({
      soundcloud_url: soundcloudUrl,
      title: title,
    });

    if (success) {
      setSoundcloudUrl('');
      setTitle('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="add-set-form">
      <h2>Add a New Set</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Set Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Summer Mix 2024"
          />
        </div>

        <div className="form-group">
          <label htmlFor="soundcloud-url">SoundCloud URL</label>
          <input
            id="soundcloud-url"
            type="url"
            value={soundcloudUrl}
            onChange={(e) => setSoundcloudUrl(e.target.value)}
            placeholder="https://soundcloud.com/..."
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Set'}
        </button>
      </form>
    </div>
  );
}

export default AddSetForm;
