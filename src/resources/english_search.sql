--Step 1: Equals search
SELECT id
FROM en_search
WHERE en_lm = "tEst" --Sample search text
COLLATE NOCASE;

--Step 2: MATCH search
SELECT id
FROM en_search
WHERE en_lm MATCH "tEst" --Sample search text
COLLATE NOCASE;
