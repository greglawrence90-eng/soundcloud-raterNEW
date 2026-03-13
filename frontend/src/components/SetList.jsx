  import SetCard from './SetCard';

  function SetList({ sets, currentUsername, onRate, onDelete }) {
    if (sets.length === 0) {
      return (
        <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem', marginTop: '40px' }}>
          No sets yet. Be the first to add one!
        </div>
      );
    }

    return (
      <div className="sets-list">
        {sets.map((set) => (
          <SetCard
            key={set.id}
            set={set}
            currentUsername={currentUsername}
            onRate={onRate}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  export default SetList;
