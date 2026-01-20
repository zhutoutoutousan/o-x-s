import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HarryPotterMagic.css';

export interface Spell {
  id: string;
  name: string;
  incantation: string;
  effect: string;
  icon: string;
  color: string;
  category: 'love' | 'memory' | 'romance' | 'bond';
}

export interface Potion {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  effect: string;
  icon: string;
  color: string;
}

interface HarryPotterMagicProps {
  onSpellCast?: (spell: Spell) => void;
  onPotionBrew?: (potion: Potion) => void;
}

const LOVE_SPELLS: Spell[] = [
  {
    id: 'amortentia',
    name: 'Amortentia',
    incantation: 'Amor Aeternus',
    effect: 'Reveals the most beautiful memories of your love',
    icon: '💕',
    color: '#ff6b9d',
    category: 'love'
  },
  {
    id: 'patronus',
    name: 'Patronus Charm',
    incantation: 'Expecto Patronum',
    effect: 'Summons happy memories together',
    icon: '🦌',
    color: '#c77dff',
    category: 'memory'
  },
  {
    id: 'lumos',
    name: 'Lumos',
    incantation: 'Lumos Amoris',
    effect: 'Lights up your love story',
    icon: '✨',
    color: '#d4af37',
    category: 'romance'
  },
  {
    id: 'unbreakable',
    name: 'Unbreakable Vow',
    incantation: 'Votum Aeternum',
    effect: 'Strengthens your eternal bond',
    icon: '💍',
    color: '#ffd700',
    category: 'bond'
  }
];

const LOVE_POTIONS: Potion[] = [
  {
    id: 'love-potion',
    name: 'Love Potion',
    description: 'A magical elixir that enhances romantic feelings',
    ingredients: ['Rose Petals', 'Moonlight', 'Heart Strings', 'Golden Tears'],
    effect: '+50 Love Points',
    icon: '🧪',
    color: '#ff6b9d'
  },
  {
    id: 'memory-potion',
    name: 'Memory Potion',
    description: 'Preserves precious moments forever',
    ingredients: ['Pensieve Essence', 'Silver Threads', 'Stardust', 'Whispered Promises'],
    effect: 'Unlocks a memory achievement',
    icon: '💭',
    color: '#c77dff'
  },
  {
    id: 'bond-potion',
    name: 'Bond Strengthening Potion',
    description: 'Deepens the connection between soulmates',
    ingredients: ['Phoenix Feather', 'Dragon Scale', 'Unicorn Hair', 'Shared Dreams'],
    effect: '+100 Love Points',
    icon: '💝',
    color: '#d4af37'
  }
];

const HOUSES = [
  {
    name: 'Gryffindor',
    color: '#d4af37',
    traits: ['Brave', 'Bold', 'Chivalrous'],
    icon: '🦁'
  },
  {
    name: 'Hufflepuff',
    color: '#ffd700',
    traits: ['Loyal', 'Kind', 'Patient'],
    icon: '🦡'
  },
  {
    name: 'Ravenclaw',
    color: '#0e4b99',
    traits: ['Wise', 'Creative', 'Curious'],
    icon: '🦅'
  },
  {
    name: 'Slytherin',
    color: '#2a623d',
    traits: ['Ambitious', 'Cunning', 'Resourceful'],
    icon: '🐍'
  }
];

export const HarryPotterMagic: React.FC<HarryPotterMagicProps> = ({
  onSpellCast,
  onPotionBrew
}) => {
  const [activeTab, setActiveTab] = useState<'spells' | 'potions' | 'sorting'>('spells');
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [castingSpell, setCastingSpell] = useState<Spell | null>(null);
  const [brewingPotion, setBrewingPotion] = useState<Potion | null>(null);

  const handleCastSpell = (spell: Spell) => {
    setCastingSpell(spell);
    onSpellCast?.(spell);
    setTimeout(() => setCastingSpell(null), 3000);
  };

  const handleBrewPotion = (potion: Potion) => {
    setBrewingPotion(potion);
    onPotionBrew?.(potion);
    setTimeout(() => setBrewingPotion(null), 3000);
  };

  const handleSorting = (houseName: string) => {
    setSelectedHouse(houseName);
  };

  return (
    <div className="hp-magic-container">
      <div className="magic-tabs">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('spells')}
          className={`magic-tab ${activeTab === 'spells' ? 'active' : ''}`}
        >
          ✨ Spells
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('potions')}
          className={`magic-tab ${activeTab === 'potions' ? 'active' : ''}`}
        >
          🧪 Potions
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('sorting')}
          className={`magic-tab ${activeTab === 'sorting' ? 'active' : ''}`}
        >
          🎩 Sorting Hat
        </motion.button>
      </div>

      <div className="magic-content">
        <AnimatePresence mode="wait">
          {activeTab === 'spells' && (
            <motion.div
              key="spells"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="spells-section"
            >
              <h3 className="section-header">Love Spells</h3>
              <div className="spells-grid">
                {LOVE_SPELLS.map((spell) => (
                  <motion.div
                    key={spell.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="spell-card"
                    style={{ borderColor: spell.color }}
                    onClick={() => handleCastSpell(spell)}
                  >
                    <div className="spell-icon" style={{ color: spell.color }}>
                      {spell.icon}
                    </div>
                    <h4 className="spell-name">{spell.name}</h4>
                    <p className="spell-incantation">"{spell.incantation}"</p>
                    <p className="spell-effect">{spell.effect}</p>
                    <div className="spell-cast-btn" style={{ background: spell.color }}>
                      Cast Spell
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'potions' && (
            <motion.div
              key="potions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="potions-section"
            >
              <h3 className="section-header">Love Potions</h3>
              <div className="potions-grid">
                {LOVE_POTIONS.map((potion) => (
                  <motion.div
                    key={potion.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="potion-card"
                    style={{ borderColor: potion.color }}
                    onClick={() => handleBrewPotion(potion)}
                  >
                    <div className="potion-icon" style={{ color: potion.color }}>
                      {potion.icon}
                    </div>
                    <h4 className="potion-name">{potion.name}</h4>
                    <p className="potion-description">{potion.description}</p>
                    <div className="potion-ingredients">
                      <strong>Ingredients:</strong>
                      <ul>
                        {potion.ingredients.map((ingredient, idx) => (
                          <li key={idx}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="potion-effect" style={{ color: potion.color }}>
                      {potion.effect}
                    </div>
                    <div className="potion-brew-btn" style={{ background: potion.color }}>
                      Brew Potion
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'sorting' && (
            <motion.div
              key="sorting"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="sorting-section"
            >
              <h3 className="section-header">Hogwarts House Sorting</h3>
              <div className="sorting-hat-container">
                <div className="sorting-hat">🎩</div>
                <p className="sorting-text">
                  {selectedHouse 
                    ? `"Hmm, interesting... ${selectedHouse}!"`
                    : '"The Sorting Hat will decide your house based on your love story..."'
                  }
                </p>
              </div>
              <div className="houses-grid">
                {HOUSES.map((house) => (
                  <motion.div
                    key={house.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`house-card ${selectedHouse === house.name ? 'selected' : ''}`}
                    style={{ borderColor: house.color }}
                    onClick={() => handleSorting(house.name)}
                  >
                    <div className="house-icon" style={{ color: house.color }}>
                      {house.icon}
                    </div>
                    <h4 className="house-name" style={{ color: house.color }}>
                      {house.name}
                    </h4>
                    <div className="house-traits">
                      {house.traits.map((trait, idx) => (
                        <span key={idx} className="trait-badge" style={{ background: house.color }}>
                          {trait}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {castingSpell && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="spell-effect-overlay"
          >
            <div className="spell-animation" style={{ color: castingSpell.color }}>
              <div className="spell-icon-large">{castingSpell.icon}</div>
              <div className="spell-incantation-large">"{castingSpell.incantation}"</div>
              <div className="spell-particles"></div>
            </div>
          </motion.div>
        )}

        {brewingPotion && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="potion-effect-overlay"
          >
            <div className="potion-animation" style={{ color: brewingPotion.color }}>
              <div className="potion-icon-large">{brewingPotion.icon}</div>
              <div className="potion-bubbles"></div>
              <div className="potion-text">Brewing {brewingPotion.name}...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
