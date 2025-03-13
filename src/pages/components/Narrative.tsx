// src/components/Narrative.tsx
import React, { FC, useEffect, useState } from 'react';

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

  if (!narrative) return <div>Loading narrative...</div>;

  return (
    <div className="narrative-container">
      <img src={narrative.artUrl} alt="Narrative Art" className="narrative-art" />
      <div className="narrative-text">
        <p>{narrative.text}</p>
      </div>
      <div className="choices">
        {narrative.choices.map(choice => (
          <button key={choice.id} onClick={() => handleChoice(choice.id)} className="choice-button">
            {choice.label}
          </button>
        ))}
      </div>
      <style jsx>{`
        .narrative-container {
          max-width: 800px;
          text-align: center;
        }
        .narrative-art {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 1rem;
        }
        .narrative-text p {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        .choices {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        .choice-button {
          background: #ff4081;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .choice-button:hover {
          background: #e73370;
        }
      `}</style>
    </div>
  );
};

export default Narrative;