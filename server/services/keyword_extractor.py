# File: services/keyword_extractor.py
import string
from typing import List

# Simple list of common words to filter out
STOP_WORDS = {
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'and', 'but', 'or', 'to', 'in', 'on', 'at',
    'what', 'why', 'how', 'where', 'when', 'which', 'who', 'whom', 'whose', 'of', 'for', 'with',
    'i', 'me', 'my', 'you', 'your', 'it', 'its', 'he', 'she', 'we', 'they', 'them', 'this', 'that'
}


class KeywordExtractor:
    """
    Performs local, synchronous keyword extraction using lightweight heuristics 
    to create search queries without an LLM call.
    """

    def extract_keywords(self, query: str) -> List[str]:
        """
        Processes query by normalizing text, removing punctuation, and filtering stop words.
        """
        if not query:
            return []   # ✅ FIX: Return empty list instead of None

        # 1. Lowercase and remove punctuation
        normalized_query = query.lower().translate(
            str.maketrans('', '', string.punctuation)
        )

        # 2. Tokenize and filter stop words
        tokens = normalized_query.split()

        keywords = []   # ✅ FIX: Properly initialize list

        for token in tokens:
            if token and token not in STOP_WORDS:
                keywords.append(token)

        # ✅ FIX: Degradation logic fallback if too few keywords extracted
        if len(keywords) < 3:
            return [normalized_query]

        return keywords
