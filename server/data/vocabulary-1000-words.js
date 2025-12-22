/**
 * 1000 Vocabulary Words for Kids (Ages 6-14)
 * Organized by difficulty and theme for educational value
 */

const VOCABULARY_WORDS_1000 = [
  // Basic Emotions & Feelings (50 words)
  'happy', 'sad', 'angry', 'excited', 'nervous', 'proud', 'brave', 'calm', 'cheerful', 'grateful',
  'joyful', 'worried', 'confused', 'curious', 'eager', 'friendly', 'gentle', 'kind', 'loyal', 'patient',
  'peaceful', 'playful', 'polite', 'shy', 'silly', 'thoughtful', 'caring', 'confident', 'content', 'delighted',
  'enthusiastic', 'generous', 'gracious', 'humble', 'jolly', 'merry', 'optimistic', 'pleasant', 'sincere', 'tender',
  'warm', 'affectionate', 'compassionate', 'empathetic', 'sympathetic', 'understanding', 'welcoming', 'loving', 'serene', 'tranquil',

  // Character Traits (50 words)
  'honest', 'brave', 'clever', 'creative', 'determined', 'fair', 'helpful', 'independent', 'responsible', 'trustworthy',
  'wise', 'ambitious', 'bold', 'courageous', 'dependable', 'diligent', 'earnest', 'faithful', 'hardworking', 'industrious',
  'intelligent', 'keen', 'motivated', 'persistent', 'reliable', 'resourceful', 'studious', 'talented', 'vibrant', 'vigilant',
  'active', 'adaptable', 'adventurous', 'alert', 'attentive', 'careful', 'cautious', 'diplomatic', 'flexible', 'focused',
  'imaginative', 'innovative', 'inventive', 'observant', 'organized', 'practical', 'punctual', 'sensible', 'thorough', 'versatile',

  // Physical Descriptions (50 words)
  'large', 'small', 'tall', 'short', 'wide', 'narrow', 'thick', 'thin', 'heavy', 'light',
  'bright', 'dark', 'colorful', 'pale', 'vivid', 'shiny', 'dull', 'smooth', 'rough', 'soft',
  'hard', 'sharp', 'round', 'square', 'curved', 'straight', 'steep', 'flat', 'deep', 'shallow',
  'strong', 'weak', 'sturdy', 'fragile', 'solid', 'hollow', 'dense', 'sparse', 'compact', 'spacious',
  'enormous', 'tiny', 'gigantic', 'miniature', 'massive', 'petite', 'colossal', 'microscopic', 'towering', 'minuscule',

  // Nature & Weather (50 words)
  'sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'foggy', 'snowy', 'humid', 'dry', 'warm',
  'cool', 'hot', 'cold', 'freezing', 'tropical', 'arctic', 'temperate', 'mild', 'pleasant', 'harsh',
  'beautiful', 'scenic', 'majestic', 'peaceful', 'wild', 'natural', 'fertile', 'barren', 'lush', 'arid',
  'blooming', 'flourishing', 'thriving', 'withering', 'budding', 'sprouting', 'growing', 'expanding', 'spreading', 'climbing',
  'flowing', 'rushing', 'trickling', 'cascading', 'meandering', 'winding', 'swirling', 'rippling', 'sparkling', 'glistening',

  // Actions & Movement (50 words)
  'walk', 'run', 'jump', 'skip', 'hop', 'leap', 'dance', 'march', 'stride', 'shuffle',
  'crawl', 'climb', 'slide', 'glide', 'soar', 'float', 'sink', 'dive', 'swim', 'splash',
  'roll', 'tumble', 'spin', 'twirl', 'rotate', 'revolve', 'twist', 'bend', 'stretch', 'reach',
  'grab', 'grasp', 'hold', 'release', 'throw', 'catch', 'toss', 'bounce', 'kick', 'hit',
  'push', 'pull', 'lift', 'carry', 'drag', 'haul', 'transport', 'deliver', 'fetch', 'retrieve',

  // Communication (50 words)
  'speak', 'talk', 'say', 'tell', 'whisper', 'shout', 'yell', 'scream', 'murmur', 'mumble',
  'explain', 'describe', 'announce', 'declare', 'proclaim', 'state', 'express', 'communicate', 'convey', 'articulate',
  'discuss', 'debate', 'argue', 'agree', 'disagree', 'persuade', 'convince', 'negotiate', 'compromise', 'cooperate',
  'listen', 'hear', 'respond', 'reply', 'answer', 'question', 'inquire', 'ask', 'request', 'demand',
  'suggest', 'propose', 'recommend', 'advise', 'instruct', 'guide', 'direct', 'command', 'order', 'forbid',

  // Learning & Knowledge (50 words)
  'learn', 'study', 'read', 'write', 'practice', 'memorize', 'remember', 'recall', 'recognize', 'understand',
  'comprehend', 'grasp', 'realize', 'discover', 'explore', 'investigate', 'examine', 'analyze', 'evaluate', 'assess',
  'solve', 'calculate', 'measure', 'compare', 'contrast', 'classify', 'categorize', 'organize', 'arrange', 'order',
  'research', 'experiment', 'test', 'prove', 'demonstrate', 'illustrate', 'explain', 'clarify', 'interpret', 'translate',
  'teach', 'educate', 'instruct', 'train', 'coach', 'mentor', 'tutor', 'guide', 'enlighten', 'inform',

  // Thinking & Mental States (50 words)
  'think', 'wonder', 'imagine', 'dream', 'believe', 'suppose', 'assume', 'presume', 'expect', 'anticipate',
  'predict', 'forecast', 'estimate', 'guess', 'suspect', 'doubt', 'question', 'challenge', 'dispute', 'deny',
  'consider', 'ponder', 'reflect', 'contemplate', 'meditate', 'concentrate', 'focus', 'attend', 'notice', 'observe',
  'perceive', 'sense', 'detect', 'identify', 'distinguish', 'differentiate', 'discriminate', 'judge', 'evaluate', 'critique',
  'decide', 'choose', 'select', 'prefer', 'favor', 'desire', 'want', 'wish', 'hope', 'aspire',

  // Time & Sequence (50 words)
  'early', 'late', 'first', 'last', 'next', 'previous', 'before', 'after', 'during', 'meanwhile',
  'always', 'never', 'sometimes', 'often', 'rarely', 'seldom', 'frequently', 'occasionally', 'constantly', 'continuously',
  'suddenly', 'gradually', 'slowly', 'quickly', 'rapidly', 'swiftly', 'promptly', 'immediately', 'instantly', 'eventually',
  'temporary', 'permanent', 'brief', 'lengthy', 'prolonged', 'extended', 'shortened', 'abbreviated', 'fleeting', 'lasting',
  'ancient', 'modern', 'contemporary', 'current', 'recent', 'future', 'upcoming', 'past', 'historical', 'traditional',

  // Quality & Condition (50 words)
  'good', 'bad', 'excellent', 'poor', 'perfect', 'flawed', 'superior', 'inferior', 'outstanding', 'mediocre',
  'fantastic', 'terrible', 'wonderful', 'awful', 'amazing', 'horrible', 'magnificent', 'dreadful', 'splendid', 'miserable',
  'new', 'old', 'fresh', 'stale', 'clean', 'dirty', 'tidy', 'messy', 'neat', 'cluttered',
  'complete', 'incomplete', 'whole', 'partial', 'full', 'empty', 'packed', 'vacant', 'occupied', 'available',
  'valuable', 'worthless', 'precious', 'cheap', 'expensive', 'affordable', 'costly', 'economical', 'luxurious', 'modest',

  // Advanced Adjectives (50 words)
  'magnificent', 'spectacular', 'remarkable', 'extraordinary', 'exceptional', 'phenomenal', 'marvelous', 'fabulous', 'splendid', 'superb',
  'elaborate', 'intricate', 'complex', 'complicated', 'sophisticated', 'advanced', 'progressive', 'innovative', 'revolutionary', 'groundbreaking',
  'mysterious', 'enigmatic', 'puzzling', 'perplexing', 'bewildering', 'confusing', 'ambiguous', 'vague', 'unclear', 'obscure',
  'transparent', 'obvious', 'evident', 'apparent', 'clear', 'distinct', 'definite', 'precise', 'exact', 'accurate',
  'authentic', 'genuine', 'real', 'true', 'actual', 'legitimate', 'valid', 'official', 'formal', 'proper',

  // Science & Nature (50 words)
  'scientific', 'natural', 'biological', 'chemical', 'physical', 'mathematical', 'geological', 'astronomical', 'meteorological', 'ecological',
  'organic', 'synthetic', 'artificial', 'manufactured', 'processed', 'raw', 'natural', 'pure', 'refined', 'filtered',
  'liquid', 'solid', 'gas', 'plasma', 'frozen', 'melted', 'evaporated', 'condensed', 'dissolved', 'precipitated',
  'magnetic', 'electric', 'electronic', 'mechanical', 'hydraulic', 'pneumatic', 'thermal', 'nuclear', 'solar', 'renewable',
  'sustainable', 'recyclable', 'biodegradable', 'compostable', 'reusable', 'disposable', 'toxic', 'harmless', 'beneficial', 'detrimental',

  // Social & Relationships (50 words)
  'friendly', 'hostile', 'cooperative', 'competitive', 'collaborative', 'independent', 'dependent', 'interdependent', 'social', 'antisocial',
  'popular', 'unpopular', 'famous', 'unknown', 'celebrated', 'ignored', 'respected', 'disrespected', 'admired', 'despised',
  'inclusive', 'exclusive', 'welcoming', 'rejecting', 'accepting', 'judgmental', 'tolerant', 'intolerant', 'flexible', 'rigid',
  'democratic', 'authoritarian', 'fair', 'unfair', 'equal', 'unequal', 'balanced', 'imbalanced', 'just', 'unjust',
  'peaceful', 'violent', 'harmonious', 'chaotic', 'orderly', 'disorderly', 'civilized', 'barbaric', 'cultured', 'primitive',

  // Technology & Modern Life (50 words)
  'digital', 'analog', 'virtual', 'real', 'online', 'offline', 'wireless', 'wired', 'automatic', 'manual',
  'computerized', 'mechanical', 'electronic', 'electrical', 'technological', 'innovative', 'outdated', 'modern', 'ancient', 'contemporary',
  'efficient', 'inefficient', 'productive', 'unproductive', 'effective', 'ineffective', 'functional', 'dysfunctional', 'operational', 'broken',
  'connected', 'disconnected', 'linked', 'separated', 'integrated', 'isolated', 'networked', 'standalone', 'compatible', 'incompatible',
  'updated', 'obsolete', 'current', 'outdated', 'latest', 'previous', 'advanced', 'primitive', 'sophisticated', 'simple',

  // Arts & Creativity (50 words)
  'artistic', 'creative', 'imaginative', 'original', 'unique', 'innovative', 'conventional', 'traditional', 'classical', 'contemporary',
  'beautiful', 'ugly', 'attractive', 'unattractive', 'elegant', 'crude', 'graceful', 'clumsy', 'refined', 'coarse',
  'colorful', 'monochrome', 'vibrant', 'dull', 'bright', 'dim', 'vivid', 'faded', 'brilliant', 'pale',
  'melodious', 'discordant', 'harmonious', 'jarring', 'rhythmic', 'arrhythmic', 'musical', 'unmusical', 'tuneful', 'tuneless',
  'dramatic', 'subtle', 'expressive', 'bland', 'lively', 'lifeless', 'dynamic', 'static', 'animated', 'monotonous',

  // Food & Taste (50 words)
  'delicious', 'disgusting', 'tasty', 'bland', 'sweet', 'sour', 'bitter', 'salty', 'spicy', 'mild',
  'fresh', 'rotten', 'ripe', 'unripe', 'cooked', 'raw', 'baked', 'fried', 'boiled', 'grilled',
  'crunchy', 'soft', 'chewy', 'tender', 'tough', 'juicy', 'dry', 'moist', 'crispy', 'soggy',
  'nutritious', 'unhealthy', 'wholesome', 'junk', 'organic', 'processed', 'natural', 'artificial', 'homemade', 'packaged',
  'appetizing', 'unappetizing', 'savory', 'sweet', 'aromatic', 'odorless', 'fragrant', 'stinky', 'flavorful', 'tasteless',

  // Sports & Activities (50 words)
  'athletic', 'clumsy', 'agile', 'awkward', 'coordinated', 'uncoordinated', 'fit', 'unfit', 'strong', 'weak',
  'fast', 'slow', 'quick', 'sluggish', 'energetic', 'lethargic', 'active', 'sedentary', 'vigorous', 'gentle',
  'competitive', 'recreational', 'professional', 'amateur', 'expert', 'novice', 'skilled', 'unskilled', 'talented', 'inept',
  'winning', 'losing', 'victorious', 'defeated', 'successful', 'unsuccessful', 'triumphant', 'disappointed', 'champion', 'underdog',
  'challenging', 'easy', 'difficult', 'simple', 'demanding', 'effortless', 'strenuous', 'relaxing', 'intense', 'mild',

  // Health & Wellness (50 words)
  'healthy', 'sick', 'well', 'ill', 'fit', 'unfit', 'strong', 'weak', 'energetic', 'tired',
  'rested', 'exhausted', 'refreshed', 'fatigued', 'alert', 'drowsy', 'awake', 'asleep', 'conscious', 'unconscious',
  'painful', 'painless', 'comfortable', 'uncomfortable', 'sore', 'healed', 'injured', 'recovered', 'contagious', 'immune',
  'nutritious', 'unhealthy', 'balanced', 'unbalanced', 'beneficial', 'harmful', 'therapeutic', 'toxic', 'safe', 'dangerous',
  'preventive', 'curative', 'chronic', 'acute', 'mild', 'severe', 'treatable', 'incurable', 'congenital', 'acquired',

  // Abstract Concepts (50 words)
  'abstract', 'concrete', 'theoretical', 'practical', 'hypothetical', 'actual', 'possible', 'impossible', 'probable', 'improbable',
  'certain', 'uncertain', 'definite', 'indefinite', 'absolute', 'relative', 'universal', 'particular', 'general', 'specific',
  'ideal', 'realistic', 'optimistic', 'pessimistic', 'positive', 'negative', 'constructive', 'destructive', 'beneficial', 'harmful',
  'necessary', 'unnecessary', 'essential', 'optional', 'required', 'voluntary', 'mandatory', 'forbidden', 'allowed', 'prohibited',
  'logical', 'illogical', 'rational', 'irrational', 'reasonable', 'unreasonable', 'sensible', 'nonsensical', 'coherent', 'incoherent',

  // More Advanced Vocabulary (100 words)
  'abundant', 'scarce', 'plentiful', 'limited', 'ample', 'insufficient', 'adequate', 'inadequate', 'excessive', 'moderate',
  'accumulate', 'disperse', 'gather', 'scatter', 'collect', 'distribute', 'assemble', 'dismantle', 'construct', 'demolish',
  'achieve', 'fail', 'accomplish', 'abandon', 'succeed', 'falter', 'triumph', 'surrender', 'persist', 'quit',
  'adapt', 'resist', 'adjust', 'maintain', 'modify', 'preserve', 'transform', 'conserve', 'change', 'stabilize',
  'admire', 'despise', 'respect', 'scorn', 'appreciate', 'depreciate', 'value', 'devalue', 'esteem', 'disdain',
  'analyze', 'synthesize', 'examine', 'construct', 'investigate', 'conclude', 'research', 'summarize', 'study', 'generalize',
  'anxious', 'relaxed', 'worried', 'carefree', 'tense', 'calm', 'stressed', 'peaceful', 'agitated', 'serene',
  'apparent', 'hidden', 'obvious', 'obscure', 'visible', 'invisible', 'clear', 'unclear', 'evident', 'concealed',
  'approach', 'retreat', 'advance', 'withdraw', 'proceed', 'recede', 'progress', 'regress', 'forward', 'backward',
  'appropriate', 'inappropriate', 'suitable', 'unsuitable', 'proper', 'improper', 'fitting', 'unfitting', 'apt', 'inapt',

  // Additional Quality Words (100 words)
  'benevolent', 'malevolent', 'kind', 'cruel', 'generous', 'stingy', 'charitable', 'selfish', 'altruistic', 'egotistic',
  'brilliant', 'dim', 'luminous', 'dark', 'radiant', 'gloomy', 'glowing', 'shadowy', 'shining', 'murky',
  'cautious', 'reckless', 'careful', 'careless', 'prudent', 'imprudent', 'wary', 'rash', 'vigilant', 'negligent',
  'cheerful', 'gloomy', 'happy', 'sad', 'jovial', 'melancholy', 'joyous', 'sorrowful', 'merry', 'dismal',
  'courageous', 'cowardly', 'brave', 'timid', 'bold', 'fearful', 'daring', 'afraid', 'heroic', 'scared',
  'critical', 'supportive', 'harsh', 'gentle', 'severe', 'lenient', 'strict', 'permissive', 'tough', 'easy',
  'curious', 'indifferent', 'interested', 'bored', 'inquisitive', 'apathetic', 'questioning', 'uncaring', 'wondering', 'disinterested',
  'delicate', 'robust', 'fragile', 'sturdy', 'dainty', 'strong', 'fine', 'coarse', 'tender', 'tough',
  'eloquent', 'inarticulate', 'articulate', 'mumbling', 'fluent', 'stammering', 'expressive', 'monotone', 'persuasive', 'unconvincing',
  'enthusiastic', 'apathetic', 'eager', 'reluctant', 'passionate', 'indifferent', 'fervent', 'lukewarm', 'zealous', 'halfhearted',

  // Final 100 words - Rich Vocabulary
  'meticulous', 'careless', 'precise', 'sloppy', 'thorough', 'superficial', 'detailed', 'vague', 'accurate', 'inaccurate',
  'resilient', 'fragile', 'flexible', 'brittle', 'adaptable', 'rigid', 'durable', 'perishable', 'lasting', 'temporary',
  'profound', 'shallow', 'deep', 'superficial', 'meaningful', 'trivial', 'significant', 'insignificant', 'important', 'unimportant',
  'resourceful', 'helpless', 'clever', 'foolish', 'ingenious', 'simple', 'inventive', 'unoriginal', 'creative', 'derivative',
  'spectacular', 'ordinary', 'magnificent', 'plain', 'extraordinary', 'common', 'remarkable', 'unremarkable', 'impressive', 'unimpressive',
  'tranquil', 'turbulent', 'peaceful', 'chaotic', 'serene', 'stormy', 'quiet', 'noisy', 'silent', 'loud',
  'versatile', 'limited', 'flexible', 'restricted', 'adaptable', 'fixed', 'multifaceted', 'single', 'diverse', 'uniform',
  'vivacious', 'listless', 'lively', 'dull', 'spirited', 'lifeless', 'animated', 'flat', 'bubbly', 'subdued',
  'whimsical', 'serious', 'playful', 'solemn', 'fanciful', 'practical', 'imaginative', 'realistic', 'quirky', 'conventional',
  'zealous', 'indifferent', 'devoted', 'uncommitted', 'dedicated', 'halfhearted', 'committed', 'reluctant', 'ardent', 'cool',
];

module.exports = { VOCABULARY_WORDS_1000 };

