import React, { FC, useEffect, useState } from 'react';
import styles from '../public/styles/narrative.module.css';

interface Choice {
  id: string;
  label: string;
}

interface Narrative {
  text: string;
  artUrl: string;
  choices: Choice[];
}

const Narrative: FC = () => {
  const [narrative, setNarrative] = useState<Narrative | null>(null);

  useEffect(() => {
    // Replace this stub with an actual API call to your narrative logic endpoint
    const fetchNarrative = async () => {
      const data: Narrative = {
        text: "In a dystopian world where music is suppressed, you stand at a crossroads. Choose your destiny.",
        artUrl: "/images/sample-art.jpg",
        choices: [
          { id: 'pathA', label: 'Build a band and host live events' },
          { id: 'pathB', label: 'Develop a solo career using AI-driven composition' },
          { id: 'pathC', label: 'Uncover and fight the conspiracy' }
        ]
      };
      setNarrative(data);
    };

    fetchNarrative();
  }, []);

  const handleChoice = (choiceId: string) => {
    console.log(`User selected: ${choiceId}`);
    // Integrate your choice handling logic here (e.g., call Cloudflare Worker API to update progress)
  };

  if (!narrative) return <div className={styles.loading}>Loading narrative...</div>;

  return (
    <div className={styles.narrativeContainer}>
      <img src={narrative.artUrl} alt="Narrative Art" className={styles.narrativeArt} />
      <div className={styles.narrativeText}>
        <p>{narrative.text}</p>
      </div>
      <div className={styles.choices}>
        {narrative.choices.map(choice => (
          <button 
            key={choice.id} 
            onClick={() => handleChoice(choice.id)} 
            className={styles.choiceButton}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Narrative;
