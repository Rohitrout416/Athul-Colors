import { useState } from 'react';
import { motion } from 'framer-motion';
import card1 from '../img/Pigment-Fine-paste.jpg';
import card2 from '../img/Coir-Coatings.jpg';
import card3 from '../img/Artist-Paint.jpg';
import card4 from '../img/exterior_primer.png';
import card5 from '../img/exterior_economic_emulsion.png';
import card6 from '../img/exterior_gloss_emulsion.png';
import card7 from '../img/exterior_luxury_emulsion.png';
import card8 from '../img/ultra_premium_emulsion.png';
import card9 from '../img/water_proof_emulsion.png';

const images = {
  "card1.png": card1,
  "card2.png": card2,
  "card3.png": card3,
  "exterior_primer.png": card4,
  "exterior_economic_emulsion.png": card5,
  "exterior_gloss_emulsion.png": card6,
  "exterior_luxury_emulsion.png": card7,
  "ultra_premium_emulsion.png": card8,
  "water_proof_emulsion.png": card9,
};

const BASIC_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Yellow', hex: '#facc15' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#ef4444' },
];

function Card({ title, img, text, unit = 'L', onAddToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customQty, setCustomQty] = useState(1);
  // Per-color quantity state
  const [colorQty, setColorQty] = useState(
    BASIC_COLORS.reduce((acc, c) => ({ ...acc, [c.name]: 1 }), {})
  );

  const toggleCard = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setTimeout(() => setShowCustom(false), 300);
    }
  };

  const handleColorQtyChange = (colorName, val) => {
    setColorQty(prev => ({ ...prev, [colorName]: val === '' ? '' : Math.max(1, parseInt(val) || 1) }));
  };

  const handleCustomAdd = () => {
    if (!customName.trim()) return;
    if (onAddToCart) onAddToCart(customName.trim(), title, customQty);
    setCustomName('');
    setCustomQty(1);
    setShowCustom(false);
  };

  return (
    <motion.div
      className="card"
      onClick={toggleCard}
      style={{ cursor: "pointer", overflow: "hidden", display: 'flex', flexDirection: 'column' }}
      initial={{ borderRadius: "10px" }}
      animate={{ borderRadius: isOpen ? "20px" : "10px" }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="text-center">
        <img alt="card-img" src={images[img]} className="text-center img-fluid" />
      </div>

      {/* Title */}
      <div className="text-center">
        <h3 className="card-title">{title}</h3>
      </div>

      {/* Expandable Section */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="p-3"
      >
        <p className="card-text">{text}</p>

        <div className="pigment-list" onClick={(e) => e.stopPropagation()}>
          <h4 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '8px', marginTop: '10px' }}>Select Color</h4>

          {/* 5 Fixed Basic Colors */}
          {BASIC_COLORS.map(color => (
            <div key={color.name} className="pigment-item">
              <div className="pigment-info">
                <div className="pigment-swatch" style={{ background: color.hex, border: color.name === 'White' ? '1px solid #e2e8f0' : 'none' }}></div>
                <span className="pigment-name">{color.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="number"
                  min="1"
                  value={colorQty[color.name]}
                  onChange={(e) => handleColorQtyChange(color.name, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '60px', padding: '4px 6px', borderRadius: '4px',
                    border: '1px solid #e2e8f0', fontSize: '0.85rem', textAlign: 'center'
                  }}
                  placeholder={unit}
                />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{unit}</span>
                <button
                  className="pigment-add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddToCart) onAddToCart(color.name, title, colorQty[color.name]);
                  }}
                  title={`Add ${color.name} to cart`}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {/* Custom Color Toggle */}
          <div
            className="custom-color-trigger"
            onClick={(e) => {
              e.stopPropagation();
              setShowCustom(prev => !prev);
            }}
          >
            <div className="pigment-info">
              <div className="custom-swatch-icon"></div>
              <span className="pigment-name" style={{ fontStyle: 'italic' }}>Custom Color</span>
            </div>
            <span style={{ fontSize: '1rem', color: '#94a3b8' }}>
              {showCustom ? '▲' : '▼'}
            </span>
          </div>

          {/* Custom Color — Simple Text Inputs */}
          {showCustom && (
            <div className="color-picker-popover" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  className="picker-name-input"
                  placeholder="Color Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="1"
                    className="picker-name-input"
                    placeholder={`Quantity (in ${unit === 'kg' ? 'kilograms' : 'litres'})`}
                    value={customQty}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') setCustomQty('');
                      else setCustomQty(Math.max(1, parseInt(val) || 1));
                    }}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{unit}</span>
                </div>
              </div>
              <button
                className="picker-add-btn"
                onClick={handleCustomAdd}
                disabled={!customName.trim()}
                style={{ width: '100%', marginTop: '12px', opacity: customName.trim() ? 1 : 0.5 }}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Card;


