--Step 1: IN search
    --EXPLAIN QUERY PLAN
    SELECT lemma, id FROM words_info WHERE searchLemma = "양도세" COLLATE NOCASE UNION SELECT lemma, id FROM words_app WHERE writtenForm ="양도세" COLLATE NOCASE ORDER BY lemma;


--Step 2: LIKE search
    --EXPLAIN QUERY PLAN
    SELECT lemma, id FROM words_info WHERE searchLemma LIKE "양도%" COLLATE NOCASE UNION SELECT lemma, id FROM words_app WHERE writtenForm LIKE "양도%" COLLATE NOCASE ORDER BY lemma;
