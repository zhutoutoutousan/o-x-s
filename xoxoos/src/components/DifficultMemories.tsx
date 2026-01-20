'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DifficultMemories.css';

interface MemoryEntry {
  date: string;
  title: {
    en: string;
    fr: string;
    de: string;
    zh: string;
  };
  content: {
    en: string;
    fr: string;
    de: string;
    zh: string;
  };
  reflection: {
    en: string;
    fr: string;
    de: string;
    zh: string;
  };
}

const difficultMemories: MemoryEntry[] = [
  {
    date: '18/1/2026',
    title: {
      en: 'The Storm and The Calm',
      fr: 'La Tempête et Le Calme',
      de: 'Der Sturm und Die Ruhe',
      zh: '风暴与平静'
    },
    content: {
      en: `On this day, Owen suffered from a bipolar episode. In the grip of mania, he said things that were truly arrogant and disrespectful to Sue. His words reflected grandiose and malignant narcissism, creating the first truly unpleasant experience between these two souls who had found each other.

The pain was real. The hurt was deep. But as the episode passed, as the storm subsided, they found themselves in each other's arms. Owen had to take Abilify to suppress the symptoms, to quiet the storm within—like John Nash in "A Beautiful Mind," fighting the demons that threatened to tear apart what was most precious.

This moment, though painful, became part of their story. Not as a scar, but as a testament to their choice: to love despite knowing the storms that would come.`,

      fr: `Ce jour-là, Owen a souffert d'un épisode bipolaire. Pris dans l'emprise de la manie, il a dit des choses vraiment arrogantes et irrespectueuses à Sue. Ses mots reflétaient un narcissisme grandiose et malveillant, créant la première expérience vraiment désagréable entre ces deux âmes qui s'étaient trouvées.

La douleur était réelle. La blessure était profonde. Mais alors que l'épisode passait, que la tempête se calmait, ils se sont retrouvés dans les bras l'un de l'autre. Owen a dû prendre de l'Abilify pour supprimer les symptômes, pour apaiser la tempête intérieure—comme John Nash dans "Un homme d'exception", luttant contre les démons qui menaçaient de déchirer ce qui était le plus précieux.

Ce moment, bien que douloureux, est devenu partie intégrante de leur histoire. Non pas comme une cicatrice, mais comme un témoignage de leur choix : aimer malgré la connaissance des tempêtes à venir.`,

      de: `An diesem Tag erlitt Owen eine bipolare Episode. Im Griff der Manie sagte er Dinge, die wirklich arrogant und respektlos gegenüber Sue waren. Seine Worte spiegelten grandiosen und bösartigen Narzissmus wider und schufen die erste wirklich unangenehme Erfahrung zwischen diesen beiden Seelen, die sich gefunden hatten.

Der Schmerz war real. Die Verletzung war tief. Aber als die Episode vorüberging, als der Sturm sich legte, fanden sie sich in den Armen des anderen wieder. Owen musste Abilify einnehmen, um die Symptome zu unterdrücken, den Sturm in seinem Inneren zu beruhigen—wie John Nash in "A Beautiful Mind", der gegen die Dämonen kämpfte, die drohten, das zu zerstören, was am wertvollsten war.

Dieser Moment, obwohl schmerzhaft, wurde Teil ihrer Geschichte. Nicht als Narbe, sondern als Zeugnis ihrer Wahl: zu lieben, obwohl sie die Stürme kannten, die kommen würden.`,

      zh: `这一天，欧文经历了一次双相情感障碍发作。在躁狂的掌控下，他对苏说了真正傲慢和不尊重的话。他的话语反映了浮夸和恶性的自恋，在这两个找到彼此的灵魂之间创造了第一次真正不愉快的经历。

痛苦是真实的。伤害是深刻的。但随着发作过去，随着风暴平息，他们发现自己拥抱在一起。欧文不得不服用阿立哌唑来抑制症状，平息内心的风暴——就像《美丽心灵》中的约翰·纳什，与威胁要撕裂最珍贵事物的恶魔作斗争。

这一刻，虽然痛苦，却成为了他们故事的一部分。不是作为伤疤，而是作为他们选择的见证：尽管知道会来的风暴，仍然选择去爱。`
    },
    reflection: {
      en: `In "A Beautiful Mind," John Nash learns to live with his demons, to recognize what is real and what is not. Owen's journey is similar—learning to manage the storms, to take the medication that brings peace, to hold onto Sue even when the illness tries to push her away.

This memory is valuable not despite the pain, but because of it. It proves that their love is not conditional on perfect moments. It is a choice made every day, even on the hardest days.`,

      fr: `Dans "Un homme d'exception", John Nash apprend à vivre avec ses démons, à reconnaître ce qui est réel et ce qui ne l'est pas. Le parcours d'Owen est similaire—apprendre à gérer les tempêtes, à prendre les médicaments qui apportent la paix, à s'accrocher à Sue même lorsque la maladie essaie de la repousser.

Ce souvenir est précieux non pas malgré la douleur, mais à cause d'elle. Il prouve que leur amour n'est pas conditionnel aux moments parfaits. C'est un choix fait chaque jour, même les jours les plus difficiles.`,

      de: `In "A Beautiful Mind" lernt John Nash, mit seinen Dämonen zu leben, zu erkennen, was real ist und was nicht. Owens Reise ist ähnlich—zu lernen, die Stürme zu bewältigen, die Medikamente zu nehmen, die Frieden bringen, sich an Sue festzuhalten, auch wenn die Krankheit versucht, sie wegzustoßen.

Diese Erinnerung ist wertvoll, nicht trotz des Schmerzes, sondern wegen ihm. Sie beweist, dass ihre Liebe nicht von perfekten Momenten abhängt. Es ist eine Wahl, die jeden Tag getroffen wird, auch an den schwierigsten Tagen.`,

      zh: `在《美丽心灵》中，约翰·纳什学会了与他的恶魔共存，识别什么是真实的，什么不是。欧文的旅程是相似的——学会管理风暴，服用带来平静的药物，即使在疾病试图推开苏的时候也紧紧抓住她。

这段记忆之所以珍贵，不是因为痛苦，而是因为痛苦。它证明了他们的爱并不取决于完美的时刻。这是每天做出的选择，即使是在最艰难的日子里。`
    }
  }
];

export const DifficultMemories: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fr' | 'de' | 'zh'>('en');
  const [selectedMemory, setSelectedMemory] = useState(0);

  const currentMemory = difficultMemories[selectedMemory];
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  return (
    <section className="difficult-memories-section">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="memories-container"
      >
        <div className="memories-header">
          <h2 className="section-title">Valuable Pain</h2>
          <p className="section-subtitle">The storms that make the calm more precious</p>
        </div>

        <div className="memory-card">
          <div className="memory-date">{currentMemory.date}</div>
          
          <div className="language-selector">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLanguage(lang.code as any)}
                className={`lang-btn ${selectedLanguage === lang.code ? 'active' : ''}`}
              >
                <span className="lang-flag">{lang.flag}</span>
                <span className="lang-name">{lang.name}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLanguage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="memory-content"
            >
              <h3 className="memory-title">{currentMemory.title[selectedLanguage]}</h3>
              
              <div className="memory-text">
                {currentMemory.content[selectedLanguage].split('\n\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="memory-paragraph"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="memory-reflection"
              >
                <div className="reflection-icon">💭</div>
                <p className="reflection-text">{currentMemory.reflection[selectedLanguage]}</p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="memories-footer"
        >
          <p className="footer-text">
            {selectedLanguage === 'en' && "These moments are not scars—they are proof of our choice to love."}
            {selectedLanguage === 'fr' && "Ces moments ne sont pas des cicatrices—ils sont la preuve de notre choix d'aimer."}
            {selectedLanguage === 'de' && "Diese Momente sind keine Narben—sie sind der Beweis unserer Wahl zu lieben."}
            {selectedLanguage === 'zh' && "这些时刻不是伤疤——它们是我们选择去爱的证明。"}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};
