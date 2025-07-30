import './FeatureButton.css';

export const FeatureButton = ({ icon: Icon, label, onClick, className }) => {
  return (
    <button
      className={`feature-button ${className || ''}`}
      onClick={onClick}
    >
      <Icon size={16} />
      {label}
    </button>
  );
};