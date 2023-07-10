import csv
import json

csv_file = 'poke/pokemon.csv'

data = []
generationCount = {}

with open(csv_file, 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        name = row['name']
        generation = row['generation']
        pokeType = row['type1']
        pokeTypeTwo = row['type2']
        data.append({'name': name, 'generation': generation, 'type1': pokeType, 'type2': pokeTypeTwo})

        # Count the occurrences of each generation
        generationCount[generation] = generationCount.get(generation, 0) + 1

# Print the total number of Pokemon for each generation
for generation, count in generationCount.items():
    print(f"Generation {generation}: {count} Pokemon")

# Optionally, you can also print the entire generationCount dictionary
print(generationCount)
