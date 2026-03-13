  import { useState, useEffect } from 'react';
  import AddSetForm from './components/AddSetForm';
  import SetList from './components/SetList';
  import { API_URL } from './config';

  function App() {
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [sets, setSets] = useState([]);

    useEffect(() => {
      if (username) {
        localStorage.setItem('username', username);
      }
    }, [username]);

    useEffect(() => {
      fetchSets();
    }, []);

    const fetchSets = async () => {
      try {
        const response = await fetch(`${API_URL}/sets`);
        const data = await response.json();
        setSets(data);
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    };

    const handleAddSet = async (setData) => {
      try {
        const response = await fetch(`${API_URL}/sets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...setData, posted_by: username }),
        });

        if (response.ok) {
          fetchSets();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error adding set:', error);
        return false;
      }
    };

    const handleRating = async (setId, rating, hasListened) => {
      try {
        await fetch(`${API_URL}/ratings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            set_id: setId,
            username,
            rating,
            has_listened: hasListened,
          }),
        });
        fetchSets();
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    };

    const handleDelete = async (setId) => {
      if (!confirm('Are you sure you want to delete this set?')) {
        return;
      }

      try {
        await fetch(`${API_URL}/sets/${setId}`, {
          method: 'DELETE',
        });
        fetchSets();
      } catch (error) {
        console.error('Error deleting set:', error);
      }
    };

    return (
      <div className="app">
        <header>
          <h1>🎵 SoundCloud Rater</h1>
          <p>Share and rate the best sets with your crew</p>
        </header>

        {!username ? (
          <div className="username-input">
            <input
              type="text"
              placeholder="Enter your name to get started..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setUsername(e.target.value.trim());
                }
              }}
              autoFocus
            />
          </div>
        ) : (
          <>
            <div style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
              Welcome, <strong>{username}</strong>!{' '}
              <button
                onClick={() => {
                  setUsername('');
                  localStorage.removeItem('username');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
              >
                Switch User
              </button>
            </div>

            <AddSetForm onAddSet={handleAddSet} />
            <SetList sets={sets} currentUsername={username} onRate={handleRating} onDelete={handleDelete} />
          </>
        )}
      </div>
    );
  }

  export default App;
