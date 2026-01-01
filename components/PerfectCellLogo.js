'use client';

/* eslint-disable react/no-unknown-property */

import React, { useState, useEffect, useRef } from 'react';
import { playRobot } from '@/lib/audioManager';

// Diverse quotes from video games, movies, shows, and historical figures
const QUOTES = [
  // God of War
  { text: "Boy!", source: "Kratos - God of War" },
  { text: "We must be better than this.", source: "Kratos - God of War" },
  { text: "The cycle ends here.", source: "Kratos - God of War" },
  { text: "Do not be sorry. Be better.", source: "Kratos - God of War" },
  { text: "The gods are cruel and petty.", source: "Kratos - God of War" },
  { text: "In the direction of our dreams.", source: "Atreus - God of War" },
  { text: "We will be the gods we choose to be.", source: "Kratos - God of War" },

  // Doom
  { text: "Rip and tear, until it is done.", source: "Doom Slayer" },
  { text: "They are rage, brutal, without mercy.", source: "Doom" },
  { text: "But you will be worse.", source: "Doom" },
  { text: "Against all the evil Hell can conjure...", source: "Doom" },
  { text: "The only thing they fear is you.", source: "Doom Eternal" },

  // Dexter
  { text: "Tonight's the night.", source: "Dexter Morgan" },
  { text: "I'm not the monster he wanted me to be.", source: "Dexter Morgan" },
  { text: "I fake it all. I fake everything.", source: "Dexter Morgan" },
  { text: "Born in blood, both of us.", source: "Dexter Morgan" },
  { text: "Harry was right. I am a monster.", source: "Dexter Morgan" },

  // Breaking Bad
  { text: "I am the one who knocks.", source: "Walter White" },
  { text: "Say my name.", source: "Walter White" },
  { text: "I did it for me.", source: "Walter White" },
  { text: "Yeah, science!", source: "Jesse Pinkman" },
  { text: "We're done when I say we're done.", source: "Walter White" },
  { text: "Tread lightly.", source: "Walter White" },
  { text: "I am not in danger, I am the danger.", source: "Walter White" },

  // Harry Potter
  { text: "It does not do to dwell on dreams.", source: "Dumbledore - Harry Potter" },
  { text: "After all this time? Always.", source: "Severus Snape - Harry Potter" },
  { text: "Happiness can be found in the darkest of times.", source: "Dumbledore - Harry Potter" },
  { text: "It is our choices that show what we truly are.", source: "Dumbledore - Harry Potter" },
  { text: "Mischief managed.", source: "Harry Potter" },
  { text: "Not all who wander are lost.", source: "Harry Potter" },

  // Game of Thrones
  { text: "Winter is coming.", source: "House Stark - Game of Thrones" },
  { text: "A Lannister always pays his debts.", source: "Game of Thrones" },
  { text: "When you play the game of thrones, you win or you die.", source: "Cersei - GoT" },
  { text: "The night is dark and full of terrors.", source: "Melisandre - GoT" },
  { text: "What do we say to the god of death? Not today.", source: "Syrio Forel - GoT" },
  { text: "I drink and I know things.", source: "Tyrion - GoT" },
  { text: "Chaos isn't a pit. Chaos is a ladder.", source: "Littlefinger - GoT" },
  { text: "The North remembers.", source: "Game of Thrones" },

  // Gumball (Amazing World of Gumball)
  { text: "Don't hug me, I'm scared!", source: "Gumball" },
  { text: "I reject your reality and substitute my own!", source: "Gumball" },
  { text: "This is a cartoon. Physics doesn't apply.", source: "Gumball" },
  { text: "When life gives you lemons, call them yellow oranges.", source: "Gumball" },

  // Dragon Ball
  { text: "It's over 9000!", source: "Vegeta - Dragon Ball Z" },
  { text: "I am the hope of the universe!", source: "Goku - Dragon Ball" },
  { text: "I am the prince of all Saiyans!", source: "Vegeta - Dragon Ball" },
  { text: "Power comes in response to a need, not a desire.", source: "Goku - Dragon Ball" },
  { text: "Even the mightiest warriors experience fears.", source: "Piccolo - Dragon Ball" },
  { text: "Push through the pain!", source: "Goku - Dragon Ball" },
  { text: "I won't let you destroy my world!", source: "Gohan - Dragon Ball" },

  // Naruto
  { text: "Believe it!", source: "Naruto Uzumaki" },
  { text: "I never go back on my word, that's my nindo!", source: "Naruto" },
  { text: "Those who break the rules are scum.", source: "Obito - Naruto" },
  { text: "Hard work is worthless for those that don't believe.", source: "Naruto" },
  { text: "The pain of being alone is truly unbearable.", source: "Naruto" },
  { text: "If you don't take risks, you can't create a future.", source: "Monkey D. Luffy" },
  { text: "A hero always arrives late.", source: "Naruto" },

  // 300
  { text: "This is Sparta!", source: "King Leonidas - 300" },
  { text: "Tonight we dine in hell!", source: "King Leonidas - 300" },
  { text: "Spartans never retreat!", source: "300" },
  { text: "Come back with your shield, or on it.", source: "Spartan Mother - 300" },
  { text: "Give them nothing, but take from them everything!", source: "300" },

  // Assassin's Creed (Ezio)
  { text: "Requiescat in pace.", source: "Ezio Auditore" },
  { text: "Nothing is true, everything is permitted.", source: "Ezio - Assassin's Creed" },
  { text: "We work in the dark to serve the light.", source: "Ezio" },
  { text: "It is a good life we lead, brother.", source: "Ezio" },
  { text: "I have lived my life as best I could.", source: "Ezio" },

  // Imam Ali (Historical Islamic Figure)
  { text: "Silence is the best reply to a fool.", source: "Imam Ali" },
  { text: "Knowledge enlivens the soul.", source: "Imam Ali" },
  { text: "Patience is of two kinds: patience over what pains you.", source: "Imam Ali" },
  { text: "He who has a thousand friends has not a friend to spare.", source: "Imam Ali" },
  { text: "Your remedy is within you, but you do not sense it.", source: "Imam Ali" },
  { text: "Do not let your difficulties fill you with anxiety.", source: "Imam Ali" },
  { text: "A fool's mind is at the mercy of his tongue.", source: "Imam Ali" },

  // Imam Hussein
  { text: "I only desire to spread good values and prevent evil.", source: "Imam Hussein" },
  { text: "Death with dignity is better than a life of humiliation.", source: "Imam Hussein" },
  { text: "I will never give you my hand like a man who has been humiliated.", source: "Imam Hussein" },
  { text: "If you don't believe in any religion, at least be free.", source: "Imam Hussein" },

  // Alexander the Great
  { text: "I am not afraid of an army of lions led by a sheep.", source: "Alexander the Great" },
  { text: "There is nothing impossible to him who will try.", source: "Alexander the Great" },
  { text: "I would rather excel in the knowledge of what is excellent.", source: "Alexander the Great" },
  { text: "Remember upon the conduct of each depends the fate of all.", source: "Alexander the Great" },
  { text: "Through every generation of the human race there has been a constant war.", source: "Alexander the Great" },

  // Khalid ibn al-Walid (Islamic General)
  { text: "I bring you men who love death as you love life.", source: "Khalid ibn al-Walid" },
  { text: "No matter how numerous the enemy, they cannot withstand us.", source: "Khalid ibn al-Walid" },
  { text: "I have fought in so many battles seeking martyrdom.", source: "Khalid ibn al-Walid" },

  // Saladin (Salah ad-Din)
  { text: "Victory is changing the hearts of your opponents by gentleness.", source: "Saladin" },
  { text: "I warn you against shedding blood.", source: "Saladin" },
  { text: "Knowledge is a weapon, I intend to be formidably armed.", source: "Saladin" },
  { text: "If you want to destroy any nation, destroy its education.", source: "Saladin" },

  // Classic Video Games
  { text: "It's-a me, Mario!", source: "Mario - Super Mario" },
  { text: "The cake is a lie.", source: "Portal" },
  { text: "War. War never changes.", source: "Fallout" },
  { text: "All we had to do, was follow the damn train!", source: "Big Smoke - GTA San Andreas" },
  { text: "Do a barrel roll!", source: "Peppy - Star Fox" },
  { text: "Would you kindly?", source: "BioShock" },
  { text: "I used to be an adventurer like you...", source: "Skyrim Guard" },
  { text: "Stay awhile and listen!", source: "Deckard Cain - Diablo" },
  { text: "The right man in the wrong place...", source: "G-Man - Half-Life" },
  { text: "Remember, no Russian.", source: "Call of Duty: MW2" },
  { text: "Get over here!", source: "Scorpion - Mortal Kombat" },
  { text: "Finish him!", source: "Mortal Kombat" },
  { text: "A man chooses, a slave obeys.", source: "BioShock" },
  { text: "The truth is, the game was rigged from the start.", source: "Fallout: New Vegas" },
  { text: "Had to be me. Someone else might have gotten it wrong.", source: "Mass Effect" },

  // More Anime
  { text: "People die when they are killed.", source: "Shirou - Fate/Stay Night" },
  { text: "I'll take a potato chip... and eat it!", source: "Light - Death Note" },
  { text: "I am going to be King of the Pirates!", source: "Luffy - One Piece" },
  { text: "The world isn't perfect, but it's there for us trying.", source: "Roy Mustang - FMA" },
  { text: "A lesson without pain is meaningless.", source: "Edward Elric - FMA" },
  { text: "I won't run away anymore!", source: "Hinata - Naruto" },
  { text: "Fun things are fun.", source: "Yui - K-On!" },
  
  // Movies & Shows
  { text: "May the Force be with you.", source: "Star Wars" },
  { text: "I am inevitable.", source: "Thanos - Avengers" },
  { text: "You shall not pass!", source: "Gandalf - LOTR" },
  { text: "I'll be back.", source: "Terminator" },
  { text: "With great power comes great responsibility.", source: "Spider-Man" },
  { text: "I am Iron Man.", source: "Tony Stark" },
  { text: "No, I am your father.", source: "Darth Vader" },
  { text: "To infinity and beyond!", source: "Buzz Lightyear" },
  { text: "Why so serious?", source: "Joker - The Dark Knight" },
  { text: "I live, I die, I live again!", source: "Mad Max: Fury Road" },
  { text: "Witnesses!", source: "Mad Max: Fury Road" },
  
  // Historical Figures
  { text: "I came, I saw, I conquered.", source: "Julius Caesar" },
  { text: "Give me liberty, or give me death!", source: "Patrick Henry" },
  { text: "I think, therefore I am.", source: "René Descartes" },
  { text: "Be the change you wish to see.", source: "Gandhi" },
  { text: "The only thing we have to fear is fear itself.", source: "FDR" },
  { text: "Knowledge is power.", source: "Francis Bacon" },
  { text: "I have a dream.", source: "Martin Luther King Jr." },
  { text: "Et tu, Brute?", source: "Julius Caesar" },
  { text: "One small step for man...", source: "Neil Armstrong" },
  { text: "Ask not what your country can do for you...", source: "JFK" },
  { text: "The only true wisdom is knowing you know nothing.", source: "Socrates" },
  { text: "Veni, vidi, vici.", source: "Julius Caesar" },
  { text: "In the middle of difficulty lies opportunity.", source: "Albert Einstein" },
  { text: "The unexamined life is not worth living.", source: "Socrates" },
  { text: "I cannot teach anybody anything. I can only make them think.", source: "Socrates" }
];

export function PerfectCellLogo() {
  const [isJumping, setIsJumping] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [isSmiling, setIsSmiling] = useState(false);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [currentQuote, setCurrentQuote] = useState(null);
  const [showQuote, setShowQuote] = useState(false);
  const [quotePosition, setQuotePosition] = useState({ placement: 'below', style: {} });
  const [isClickCooldown, setIsClickCooldown] = useState(false);
  const [quoteKey, setQuoteKey] = useState(0); // For animation restart
  
  const logoRef = useRef(null);
  const quoteRef = useRef(null);
  const quoteTimeoutRef = useRef(null);
  const cooldownTimeoutRef = useRef(null);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (quoteTimeoutRef.current) {
        clearTimeout(quoteTimeoutRef.current);
      }
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  // Update logo position for fixed effects
  useEffect(() => {
    if (logoRef.current && (hearts.length > 0 || isJumping)) {
      const rect = logoRef.current.getBoundingClientRect();
      setLogoPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  }, [hearts, isJumping]);

  // Calculate optimal quote position (responsive for mobile)
  useEffect(() => {
    if (showQuote && logoRef.current && currentQuote) {
      const calculatePosition = () => {
        const robotRect = logoRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Safe padding from edges (more on mobile)
        const isMobile = viewportWidth < 640;
        const edgePadding = isMobile ? 16 : 24;
        const quoteMaxWidth = isMobile ? viewportWidth - (edgePadding * 2) : 280;
        
        // Estimate quote height (rough calculation)
        const estimatedQuoteHeight = isMobile ? 120 : 100;
        
        // Robot center position
        const robotCenterX = robotRect.left + robotRect.width / 2;
        const robotCenterY = robotRect.top + robotRect.height / 2;
        
        // Space available in each direction
        const spaceAbove = robotRect.top;
        const spaceBelow = viewportHeight - robotRect.bottom;
        const spaceLeft = robotRect.left;
        const spaceRight = viewportWidth - robotRect.right;
        
        let placement = 'below';
        let style = {};
        
        // Determine vertical placement (above or below)
        if (spaceBelow >= estimatedQuoteHeight + 20) {
          // Enough space below - place below
          placement = 'below';
          style.top = `${robotRect.bottom + 12}px`;
        } else if (spaceAbove >= estimatedQuoteHeight + 20) {
          // Not enough space below but space above - place above
          placement = 'above';
          style.top = `${robotRect.top - estimatedQuoteHeight - 12}px`;
        } else {
          // Very tight space - place below with scroll
          placement = 'below';
          style.top = `${robotRect.bottom + 12}px`;
        }
        
        // Determine horizontal positioning
        // Try to center on robot, but keep within safe bounds
        let leftPosition = robotCenterX - (quoteMaxWidth / 2);
        
        // Check if it would go off the left edge
        if (leftPosition < edgePadding) {
          leftPosition = edgePadding;
        }
        
        // Check if it would go off the right edge
        if (leftPosition + quoteMaxWidth > viewportWidth - edgePadding) {
          leftPosition = viewportWidth - quoteMaxWidth - edgePadding;
        }
        
        style.left = `${leftPosition}px`;
        style.maxWidth = `${quoteMaxWidth}px`;
        
        setQuotePosition({ placement, style });
      };
      
      // Calculate immediately
      calculatePosition();
      
      // Recalculate on resize (debounced)
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(calculatePosition, 100);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimeout);
      };
    }
  }, [showQuote, currentQuote]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent rapid clicks - only allow one click per cooldown period
    if (isClickCooldown) {
      console.log('[Robot] Click ignored - cooldown active');
      return;
    }

    // Set cooldown to prevent rapid clicks
    setIsClickCooldown(true);
    
    // Clear cooldown after 600ms (allows visual effects to play)
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }
    cooldownTimeoutRef.current = setTimeout(() => {
      setIsClickCooldown(false);
    }, 600);

    // Trigger jump
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 800);

    // ALWAYS show smile AND hearts!
    setIsSmiling(true);
    setTimeout(() => setIsSmiling(false), 1200);

    // Generate fewer hearts for better mobile performance
    const newHearts = [
      { id: Date.now() + 1, delay: 0, offset: -12 },
      { id: Date.now() + 2, delay: 0.1, offset: 12 },
      { id: Date.now() + 3, delay: 0.2, offset: 0 }
    ];
    setHearts(newHearts);
    
    setTimeout(() => {
      setHearts([]);
    }, 2000);

    // QUOTE MANAGEMENT WITH PROPER TIMEOUT HANDLING
    
    // Clear any existing quote timeout to prevent premature hiding
    if (quoteTimeoutRef.current) {
      clearTimeout(quoteTimeoutRef.current);
      console.log('[Robot] Cleared previous quote timeout');
    }

    // Pick random quote
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setCurrentQuote(randomQuote);
    
    // If quote is already showing, restart animation by changing key
    if (showQuote) {
      setQuoteKey(prev => prev + 1);
      console.log('[Robot] Quote already visible - restarting animation');
    } else {
      setShowQuote(true);
      console.log('[Robot] Showing new quote');
    }

    // Set NEW timeout to hide quote after FULL 5 seconds
    // This ensures each quote stays visible for the complete duration
    quoteTimeoutRef.current = setTimeout(() => {
      setShowQuote(false);
      console.log('[Robot] Quote hidden after full duration');
      quoteTimeoutRef.current = null;
    }, 5000); // 5 seconds for better readability

    // Play robot sound (shared audio manager)
    playRobot();
  };

  return (
    <>
      {/* Fixed container for hearts - prevents clipping on mobile */}
      {hearts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'visible'
          }}
        >
          {hearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute text-3xl"
              style={{
                left: `${logoPosition.x + heart.offset}px`,
                top: `${logoPosition.y - 20}px`,
                transform: 'translate(-50%, 0)',
                animation: `heart-float-super 1.8s ease-out forwards`,
                animationDelay: `${heart.delay}s`,
                textShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
              }}
            >
              💚
            </div>
          ))}
        </div>
      )}

      {/* Fixed container for sparkles - prevents clipping */}
      {isJumping && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9998,
            overflow: 'visible'
          }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-yellow-400 text-xl"
              style={{
                left: `${logoPosition.x}px`,
                top: `${logoPosition.y}px`,
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-30px)`,
                animation: 'sparkle-pop 0.6s ease-out forwards',
                animationDelay: `${i * 0.05}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Quote Bubble - appears after click (RESPONSIVE) */}
      {showQuote && currentQuote && (
        <div
          key={quoteKey} // Forces animation restart on new quote
          ref={quoteRef}
          className="fixed z-[10000] pointer-events-none"
          style={{
            ...quotePosition.style,
            width: 'auto',
          }}
        >
          <div 
            className="relative bg-gradient-to-br from-bio-green-500/95 to-emerald-600/95 text-white rounded-2xl shadow-2xl border-2 border-bio-green-400 w-full"
            style={{
              animation: 'quote-pop-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
              padding: 'clamp(12px, 3vw, 16px)',
            }}
          >
            {/* Speech bubble arrow - positioned based on placement */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0"
              style={{
                [quotePosition.placement === 'above' ? 'bottom' : 'top']: '-10px',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                [quotePosition.placement === 'above' ? 'borderTop' : 'borderBottom']: '10px solid rgb(34 197 94)',
              }}
            />
            
            {/* Quote text - responsive sizing */}
            <p 
              className="font-semibold mb-1.5 leading-tight break-words"
              style={{
                fontSize: 'clamp(13px, 3.5vw, 15px)',
                lineHeight: '1.4',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
              }}
            >
              &ldquo;{currentQuote.text}&rdquo;
            </p>
            
            {/* Source - responsive sizing */}
            <p 
              className="opacity-90 italic break-words"
              style={{
                fontSize: 'clamp(11px, 3vw, 13px)',
                lineHeight: '1.3',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              &mdash; {currentQuote.source}
            </p>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-bio-green-400 to-emerald-400 opacity-30 blur-xl -z-10 animate-pulse" />
          </div>
        </div>
      )}

      <div 
        ref={logoRef}
        className={`relative w-10 h-10 pixel-art cursor-pointer ${isJumping ? '' : 'animate-float'}`}
        onClick={handleClick}
        style={{
          animation: isJumping ? 'cell-super-jump 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : undefined,
          transition: 'transform 0.3s ease'
        }}
      >
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Perfect Cell inspired pixel art */}
          {/* Head outline - green */}
          <rect x="10" y="4" width="12" height="2" fill="#22c55e" />
          <rect x="8" y="6" width="16" height="2" fill="#22c55e" />
          <rect x="6" y="8" width="20" height="12" fill="#22c55e" />
          <rect x="8" y="20" width="16" height="2" fill="#22c55e" />
          <rect x="10" y="22" width="12" height="2" fill="#22c55e" />
          
          {/* Face - darker green */}
          <rect x="8" y="8" width="16" height="10" fill="#15803d" />
          
          {/* Eyes - glowing green (animated when smiling) */}
          {isSmiling ? (
            <>
              {/* BIG Happy eyes - curved */}
              <rect x="10" y="12" width="4" height="2" fill="#4ade80" className="animate-pulse" />
              <rect x="18" y="12" width="4" height="2" fill="#4ade80" className="animate-pulse" />
            </>
          ) : (
            <>
              {/* Normal eyes */}
              <rect x="11" y="11" width="3" height="3" fill="#4ade80" className="animate-pulse" />
              <rect x="18" y="11" width="3" height="3" fill="#4ade80" className="animate-pulse" />
            </>
          )}
          
          {/* Mouth/expression */}
          {isSmiling ? (
            <>
              {/* BIGGER smile */}
              <rect x="11" y="16" width="2" height="1" fill="#86efac" />
              <rect x="12" y="17" width="7" height="1" fill="#86efac" />
              <rect x="19" y="16" width="2" height="1" fill="#86efac" />
              <rect x="13" y="18" width="5" height="1" fill="#86efac" />
            </>
          ) : (
            <>
              {/* Normal mouth */}
              <rect x="13" y="16" width="6" height="1" fill="#86efac" />
            </>
          )}
          
          {/* Spots/details - yellow-green (pulse when smiling) */}
          <rect x="10" y="9" width="1" height="1" fill="#a3e635" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="21" y="9" width="1" height="1" fill="#a3e635" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="9" y="13" width="1" height="1" fill="#a3e635" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="22" y="13" width="1" height="1" fill="#a3e635" className={isSmiling ? 'animate-pulse' : ''} />
          
          {/* Antennae - pulse faster when happy */}
          <rect x="12" y="2" width="2" height="2" fill="#22c55e" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="18" y="2" width="2" height="2" fill="#22c55e" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="13" y="0" width="1" height="2" fill="#4ade80" className="animate-pulse" />
          <rect x="19" y="0" width="1" height="2" fill="#4ade80" className="animate-pulse" />
        </svg>

        {/* Glow effect when clicked */}
        {isJumping && (
          <div 
            className="absolute inset-0 rounded-full bg-bio-green-500 blur-lg pointer-events-none"
            style={{ animation: 'glow-burst 0.8s ease-out forwards' }}
          />
        )}

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-full bg-bio-green-500 opacity-0 hover:opacity-30 blur-md transition-opacity duration-300 pointer-events-none" />
      </div>

      <style jsx global>{`
        @keyframes cell-super-jump {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-25px) rotate(-15deg) scale(1.2);
          }
          50% {
            transform: translateY(-35px) rotate(10deg) scale(1.25);
          }
          65% {
            transform: translateY(-20px) rotate(-8deg) scale(1.15);
          }
          80% {
            transform: translateY(-8px) rotate(5deg) scale(1.05);
          }
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
        }

        @keyframes heart-float-super {
          0% {
            transform: translate(-50%, 0) scale(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -10px) scale(1) rotate(10deg);
          }
          100% {
            transform: translate(-50%, -80px) scale(1.3) rotate(-20deg);
            opacity: 0;
          }
        }

        @keyframes sparkle-pop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(0deg) translateY(-20px) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(45deg) translateY(-50px) scale(1.5);
          }
        }

        @keyframes glow-burst {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(3);
          }
        }

        @keyframes quote-pop-in {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(-20px);
          }
          60% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
