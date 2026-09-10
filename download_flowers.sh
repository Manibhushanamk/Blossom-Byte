#!/bin/bash
cd public/assets/products || exit

count=0

for file in *.jpg; do
  keyword="flower"
  if [[ "$file" == *"bouquets"* ]]; then
    keyword="flower,bouquet"
  elif [[ "$file" == *"decor"* ]]; then
    keyword="flower,decoration"
  elif [[ "$file" == *"fresh"* ]]; then
    keyword="flower,fresh"
  elif [[ "$file" == *"plants"* ]]; then
    keyword="plant,indoor"
  elif [[ "$file" == *"seeds"* ]]; then
    keyword="seed,plant"
  elif [[ "$file" == *"gift"* ]]; then
    keyword="gift,flower"
  fi

  # Extract the number from the filename (or use a random hash to lock)
  # to make sure images are unique but stable
  lock_id=$(echo "$file" | md5sum | head -c 5 | tr -d a-f)
  if [[ -z "$lock_id" ]]; then lock_id=$RANDOM; fi

  url="https://loremflickr.com/600/800/${keyword}?lock=${lock_id}"
  
  # Run curl in the background to parallelize
  curl -s -L "$url" -o "$file" &
  
  # Limit to 10 parallel jobs
  ((count++))
  if (( count % 10 == 0 )); then
    wait
  fi
done
wait
echo "All done downloading new keyword images."
