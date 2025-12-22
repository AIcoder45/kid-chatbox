/**
 * Fallback synonyms and antonyms for common words
 * Used when Dictionary API doesn't provide them
 */

const SYNONYMS_ANTONYMS_FALLBACK = {
  // A
  assume: {
    synonyms: ['presume', 'suppose', 'believe', 'think', 'expect'],
    antonyms: ['prove', 'verify', 'confirm', 'validate'],
  },
  abundant: {
    synonyms: ['plentiful', 'ample', 'copious', 'rich'],
    antonyms: ['scarce', 'sparse', 'limited', 'insufficient'],
  },
  
  // B
  benevolent: {
    synonyms: ['kind', 'generous', 'charitable', 'caring'],
    antonyms: ['cruel', 'selfish', 'mean', 'harsh'],
  },
  brilliant: {
    synonyms: ['bright', 'smart', 'intelligent', 'clever'],
    antonyms: ['dull', 'dim', 'stupid', 'foolish'],
  },
  
  // C
  cautious: {
    synonyms: ['careful', 'wary', 'prudent', 'vigilant'],
    antonyms: ['reckless', 'careless', 'rash', 'hasty'],
  },
  complex: {
    synonyms: ['complicated', 'intricate', 'elaborate'],
    antonyms: ['simple', 'easy', 'basic', 'straightforward'],
  },
  
  // D
  diligent: {
    synonyms: ['hardworking', 'industrious', 'dedicated'],
    antonyms: ['lazy', 'careless', 'negligent'],
  },
  
  // E
  eloquent: {
    synonyms: ['articulate', 'expressive', 'fluent'],
    antonyms: ['inarticulate', 'awkward', 'clumsy'],
  },
  ephemeral: {
    synonyms: ['temporary', 'fleeting', 'brief', 'short-lived'],
    antonyms: ['permanent', 'lasting', 'eternal', 'enduring'],
  },
  
  // F
  flexible: {
    synonyms: ['adaptable', 'pliable', 'versatile'],
    antonyms: ['rigid', 'inflexible', 'stiff'],
  },
  
  // G
  gracious: {
    synonyms: ['polite', 'courteous', 'kind', 'cordial'],
    antonyms: ['rude', 'impolite', 'discourteous'],
  },
  
  // H
  humble: {
    synonyms: ['modest', 'meek', 'unassuming'],
    antonyms: ['arrogant', 'proud', 'boastful'],
  },
  
  // I
  innovative: {
    synonyms: ['creative', 'original', 'inventive'],
    antonyms: ['conventional', 'traditional', 'ordinary'],
  },
  intelligent: {
    synonyms: ['smart', 'clever', 'bright', 'brilliant'],
    antonyms: ['stupid', 'dumb', 'foolish', 'ignorant'],
  },
  
  // L
  luminous: {
    synonyms: ['bright', 'radiant', 'glowing', 'shining'],
    antonyms: ['dark', 'dim', 'dull', 'gloomy'],
  },
  
  // M
  meticulous: {
    synonyms: ['careful', 'thorough', 'precise', 'detailed'],
    antonyms: ['careless', 'sloppy', 'negligent'],
  },
  magnificent: {
    synonyms: ['splendid', 'grand', 'impressive', 'spectacular'],
    antonyms: ['ordinary', 'plain', 'modest', 'unimpressive'],
  },
  
  // O
  optimistic: {
    synonyms: ['hopeful', 'positive', 'confident'],
    antonyms: ['pessimistic', 'negative', 'hopeless'],
  },
  
  // P
  profound: {
    synonyms: ['deep', 'intense', 'significant', 'meaningful'],
    antonyms: ['shallow', 'superficial', 'trivial'],
  },
  persistent: {
    synonyms: ['determined', 'tenacious', 'steadfast'],
    antonyms: ['inconsistent', 'wavering', 'quitting'],
  },
  
  // R
  resilient: {
    synonyms: ['strong', 'tough', 'flexible', 'adaptable'],
    antonyms: ['weak', 'fragile', 'brittle'],
  },
  remarkable: {
    synonyms: ['extraordinary', 'notable', 'impressive'],
    antonyms: ['ordinary', 'common', 'unremarkable'],
  },
  
  // S
  sincere: {
    synonyms: ['genuine', 'honest', 'truthful', 'authentic'],
    antonyms: ['insincere', 'fake', 'dishonest', 'false'],
  },
  spectacular: {
    synonyms: ['impressive', 'stunning', 'amazing', 'magnificent'],
    antonyms: ['ordinary', 'boring', 'dull', 'unimpressive'],
  },
  
  // T
  thoughtful: {
    synonyms: ['considerate', 'caring', 'attentive', 'kind'],
    antonyms: ['thoughtless', 'careless', 'inconsiderate'],
  },
  tranquil: {
    synonyms: ['peaceful', 'calm', 'serene', 'quiet'],
    antonyms: ['chaotic', 'turbulent', 'noisy', 'stormy'],
  },
  
  // V
  versatile: {
    synonyms: ['adaptable', 'flexible', 'multifaceted'],
    antonyms: ['limited', 'inflexible', 'specialized'],
  },
  vibrant: {
    synonyms: ['lively', 'energetic', 'vivid', 'dynamic'],
    antonyms: ['dull', 'lifeless', 'boring', 'monotonous'],
  },
  
  // W
  whimsical: {
    synonyms: ['playful', 'fanciful', 'quirky', 'imaginative'],
    antonyms: ['serious', 'practical', 'conventional'],
  },
  
  // Z
  zealous: {
    synonyms: ['enthusiastic', 'passionate', 'fervent', 'devoted'],
    antonyms: ['apathetic', 'indifferent', 'lukewarm'],
  },
};

module.exports = { SYNONYMS_ANTONYMS_FALLBACK };

